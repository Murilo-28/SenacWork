import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';
import {
  alternarEncontrado,
  carregarItens,
  carregarMensagens,
  excluirItem,
  type Item,
} from '../lib/itens';

export default function Home() {
  const { modoEscuro } = useTema();
  const insets = useSafeAreaInsets();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(
    () => criarEstilos(cores, insets.bottom),
    [cores, insets.bottom]
  );

  const [itens, setItens] = useState<Item[]>([]);
  const [respostas, setRespostas] = useState<Record<string, number>>({});
  const [emailLogado, setEmailLogado] = useState('');
  const [confirmando, setConfirmando] = useState<string | null>(null);

  // Recarrega toda vez que a tela volta a ficar em foco
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const lista = await carregarItens();
        const mensagens = await carregarMensagens();
        const logado = await AsyncStorage.getItem('usuarioLogado');

        const contagem: Record<string, number> = {};
        mensagens.forEach((m) => {
          contagem[m.chave] = (contagem[m.chave] ?? 0) + 1;
        });

        setItens(lista);
        setRespostas(contagem);
        setEmailLogado(logado ? JSON.parse(logado).email ?? '' : '');
        setConfirmando(null);
      }

      carregar();
    }, [])
  );

  function adicionarProduto() {
    router.push('/addProduto');
  }

  function abrirItem(chave: string) {
    router.push({ pathname: '/item', params: { chave } });
  }

  function inverter(chave: string) {
    setItens((atual) =>
      atual.map((i) =>
        i.chave === chave ? { ...i, encontrado: !i.encontrado } : i
      )
    );
  }

  async function alternar(chave: string) {
    // Atualiza na hora; se falhar ao salvar, desfaz
    inverter(chave);

    try {
      await alternarEncontrado(chave);
    } catch (erro) {
      console.log('Erro ao marcar item como encontrado:', erro);
      inverter(chave);
    }
  }

  async function excluir(chave: string) {
    try {
      await excluirItem(chave);
      setItens((atual) => atual.filter((i) => i.chave !== chave));
      setConfirmando(null);
    } catch (erro) {
      console.log('Erro ao excluir item:', erro);
    }
  }

  function renderItem({ item }: { item: Item }) {
    const total = respostas[item.chave] ?? 0;
    const comResposta = total > 0;
    const ehDono = !!emailLogado && item.donoEmail === emailLogado;
    const pedindoConfirmacao = confirmando === item.chave;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.item,
          item.encontrado && styles.itemEncontrado,
          pressed && styles.itemPressionado,
        ]}
        onPress={() => abrirItem(item.chave)}
      >
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.itemFoto} />
        ) : (
          <View style={[styles.itemFoto, styles.itemSemFoto]}>
            <Ionicons name="cube-outline" size={26} color={cores.primario} />
          </View>
        )}

        <View style={styles.itemTextos}>
          <View style={styles.itemTopo}>
            <Text style={styles.itemNome} numberOfLines={1}>
              {item.titulo}
            </Text>

            {item.encontrado ? (
              <View style={[styles.status, styles.statusEncontrado]}>
                <Text style={[styles.statusTexto, styles.statusTextoEncontrado]}>
                  Encontrado
                </Text>
              </View>
            ) : (
              <View
                style={[styles.status, comResposta && styles.statusResposta]}
              >
                <Text
                  style={[
                    styles.statusTexto,
                    comResposta && styles.statusTextoResposta,
                  ]}
                >
                  {comResposta ? 'Com resposta' : 'Perdido'}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.itemInfo} numberOfLines={1}>
            {item.local} · {item.data}
          </Text>

          <View style={styles.itemRodape}>
            <Ionicons
              name="chatbubble-outline"
              size={13}
              color={cores.secundario}
            />
            <Text style={styles.itemInfo}>
              {total === 1 ? '1 mensagem' : `${total} mensagens`}
            </Text>
          </View>

          {/* CONFIRMAR EXCLUSÃO (só o dono chega aqui) */}
          {pedindoConfirmacao ? (
            <View style={styles.confirma}>
              <Text style={styles.confirmaTexto}>Excluir este item?</Text>

              <View style={styles.confirmaBotoes}>
                <Pressable
                  style={styles.botaoCancelar}
                  onPress={() => setConfirmando(null)}
                  hitSlop={6}
                >
                  <Text style={styles.textoCancelar}>Cancelar</Text>
                </Pressable>

                <Pressable
                  style={styles.botaoExcluir}
                  onPress={() => excluir(item.chave)}
                  hitSlop={6}
                >
                  <Text style={styles.textoExcluir}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            /* AÇÕES: interruptor para todos, lixeira só para o dono */
            <View style={styles.acoes}>
              <View style={styles.grupoEncontrado}>
                <Text style={styles.opcaoTexto}>Item encontrado</Text>
                <Switch
                  value={item.encontrado}
                  onValueChange={() => alternar(item.chave)}
                  trackColor={{ false: cores.borda, true: '#1B8A4B' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {ehDono && (
                <Pressable
                  style={styles.lixeira}
                  onPress={() => setConfirmando(item.chave)}
                  hitSlop={8}
                >
                  <Ionicons name="trash-outline" size={20} color="#D32F2F" />
                </Pressable>
              )}
            </View>
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.chave}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Início</Text>
            <Text style={styles.subtitulo}>Achados e Perdidos SENAC</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <View style={styles.iconeVazio}>
              <Ionicons
                name="search-outline"
                size={26}
                color={cores.primario}
              />
            </View>
            <Text style={styles.tituloVazio}>Nenhum item por aqui</Text>
            <Text style={styles.textoVazio}>
              Toque no botão + para registrar um item perdido.
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.botaoAdicionar,
          pressed && styles.botaoPressionado,
        ]}
        onPress={adicionarProduto}
        hitSlop={8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const criarEstilos = (c: Paleta, bottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.fundo,
    },

    lista: {
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 120 + bottom,
    },

    cabecalho: {
      marginBottom: 24,
    },

    titulo: {
      fontSize: 30,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: c.texto,
    },

    subtitulo: {
      fontSize: 14,
      color: c.secundario,
      marginTop: 6,
    },

    /* ITEM */
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: c.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 12,
      marginBottom: 12,
    },

    itemEncontrado: {
      borderColor: '#1B8A4B',
    },

    itemPressionado: {
      opacity: 0.85,
    },

    itemFoto: {
      width: 64,
      height: 64,
      borderRadius: 12,
    },

    itemSemFoto: {
      backgroundColor: c.primarioSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },

    itemTextos: {
      flex: 1,
    },

    itemTopo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4,
    },

    itemNome: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700',
      color: c.texto,
    },

    itemInfo: {
      fontSize: 13,
      color: c.secundario,
    },

    itemRodape: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 6,
    },

    /* AÇÕES: ENCONTRADO + LIXEIRA */
    acoes: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: c.borda,
    },

    grupoEncontrado: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    opcaoTexto: {
      fontSize: 13,
      fontWeight: '600',
      color: c.texto,
    },

    lixeira: {
      marginLeft: 'auto',
      padding: 4,
    },

    /* CONFIRMAÇÃO */
    confirma: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: c.borda,
      gap: 10,
    },

    confirmaTexto: {
      fontSize: 13,
      fontWeight: '600',
      color: c.texto,
    },

    confirmaBotoes: {
      flexDirection: 'row',
      gap: 8,
    },

    botaoCancelar: {
      flex: 1,
      height: 36,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.borda,
      alignItems: 'center',
      justifyContent: 'center',
    },

    textoCancelar: {
      fontSize: 13,
      fontWeight: '600',
      color: c.secundario,
    },

    botaoExcluir: {
      flex: 1,
      height: 36,
      borderRadius: 10,
      backgroundColor: '#D32F2F',
      alignItems: 'center',
      justifyContent: 'center',
    },

    textoExcluir: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    /* SELOS */
    status: {
      backgroundColor: c.primarioSuave,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },

    statusResposta: {
      backgroundColor: '#E8F6EE',
    },

    statusEncontrado: {
      backgroundColor: '#1B8A4B',
    },

    statusTexto: {
      fontSize: 11,
      fontWeight: '700',
      color: c.primario,
    },

    statusTextoResposta: {
      color: '#1B8A4B',
    },

    statusTextoEncontrado: {
      color: '#FFFFFF',
    },

    /* VAZIO */
    vazio: {
      backgroundColor: c.superficie,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borda,
      paddingVertical: 36,
      paddingHorizontal: 24,
      alignItems: 'center',
    },

    iconeVazio: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.primarioSuave,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    tituloVazio: {
      fontSize: 16,
      fontWeight: '700',
      color: c.texto,
    },

    textoVazio: {
      fontSize: 13,
      lineHeight: 19,
      color: c.secundario,
      textAlign: 'center',
      marginTop: 6,
    },

    /* BOTÃO + (laranja do Senac no modo claro) */
    botaoAdicionar: {
      position: 'absolute',
      right: 24,
      bottom: 24 + bottom,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: c.acao,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.acao,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 14,
      elevation: 8,
    },

    botaoPressionado: {
      opacity: 0.88,
      transform: [{ scale: 0.96 }],
    },
  });