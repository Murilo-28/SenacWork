import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';
import {
  carregarItens,
  carregarMensagens,
  type Item,
  type Mensagem,
} from '../lib/itens';

type Filtro = 'meus' | 'todas';

export default function MensagensScreen() {
  const { modoEscuro } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [itens, setItens] = useState<Record<string, Item>>({});
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [emailLogado, setEmailLogado] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('meus');

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const listaItens = await carregarItens();
        const todas = await carregarMensagens();
        const logado = await AsyncStorage.getItem('usuarioLogado');

        const porChave: Record<string, Item> = {};
        listaItens.forEach((i) => {
          porChave[i.chave] = i;
        });

        setItens(porChave);
        setMensagens(todas);
        setEmailLogado(logado ? JSON.parse(logado).email ?? '' : '');
      }

      carregar();
    }, [])
  );

  const lista = mensagens.filter((m) => {
    const item = itens[m.chave];
    if (!item) return false;
    if (filtro === 'todas') return true;
    return !!emailLogado && item.donoEmail === emailLogado;
  });

  function abrirItem(chave: string) {
    router.push({ pathname: '/item', params: { chave } });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Mensagens</Text>
        <Text style={styles.subtitulo}>
          Quem encontrou e onde deixou o item.
        </Text>
      </View>

      {/* FILTRO */}
      <View style={styles.filtros}>
        <Pressable
          style={[styles.filtro, filtro === 'meus' && styles.filtroAtivo]}
          onPress={() => setFiltro('meus')}
        >
          <Text
            style={[
              styles.filtroTexto,
              filtro === 'meus' && styles.filtroTextoAtivo,
            ]}
          >
            Dos meus itens
          </Text>
        </Pressable>

        <Pressable
          style={[styles.filtro, filtro === 'todas' && styles.filtroAtivo]}
          onPress={() => setFiltro('todas')}
        >
          <Text
            style={[
              styles.filtroTexto,
              filtro === 'todas' && styles.filtroTextoAtivo,
            ]}
          >
            Todas
          </Text>
        </Pressable>
      </View>

      {lista.length === 0 ? (
        <View style={styles.vazio}>
          <View style={styles.iconeVazio}>
            <Ionicons
              name="chatbubbles-outline"
              size={26}
              color={cores.primario}
            />
          </View>
          <Text style={styles.tituloVazio}>Nenhuma mensagem</Text>
          <Text style={styles.textoVazio}>
            {filtro === 'meus'
              ? 'Quando alguém avisar que encontrou um item seu, a mensagem aparece aqui.'
              : 'Ainda não há mensagens em nenhum item.'}
          </Text>
        </View>
      ) : (
        lista.map((m) => {
          const item = itens[m.chave];

          return (
            <Pressable
              key={m.id}
              style={({ pressed }) => [
                styles.cartao,
                pressed && styles.cartaoPressionado,
              ]}
              onPress={() => abrirItem(m.chave)}
            >
              {/* ETIQUETA: DE QUAL ITEM É A MENSAGEM */}
              <View style={styles.etiqueta}>
                <Ionicons name="cube-outline" size={16} color={cores.primario} />
                <Text style={styles.etiquetaTexto} numberOfLines={1}>
                  {item.titulo}
                </Text>
                {item.encontrado && (
                  <View style={styles.seloEncontrado}>
                    <Text style={styles.seloTexto}>Encontrado</Text>
                  </View>
                )}
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={cores.secundario}
                />
              </View>

              {/* QUEM ACHOU */}
              <View style={styles.autor}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetra}>
                    {m.autorNome.trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>

                <View style={styles.autorTextos}>
                  <Text style={styles.autorNome}>{m.autorNome}</Text>
                  <Text style={styles.autorInfo}>achou este item</Text>
                </View>

                <Text style={styles.data}>{m.criadaEm}</Text>
              </View>

              {/* ONDE */}
              <View style={styles.linha}>
                <Ionicons name="locate-outline" size={16} color={cores.primario} />
                <Text style={styles.texto}>
                  Encontrado em:{' '}
                  <Text style={styles.negrito}>{m.ondeEncontrou}</Text>
                </Text>
              </View>

              <View style={styles.linha}>
                <Ionicons name="cube-outline" size={16} color={cores.primario} />
                <Text style={styles.texto}>
                  Deixado em: <Text style={styles.negrito}>{m.ondeDeixou}</Text>
                </Text>
              </View>

              {m.observacao ? (
                <Text style={styles.observacao}>{m.observacao}</Text>
              ) : null}
            </Pressable>
          );
        })
      )}
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.fundo,
    },

    conteudo: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 40,
    },

    cabecalho: {
      marginBottom: 20,
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

    /* FILTRO */
    filtros: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 20,
    },

    filtro: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borda,
      backgroundColor: c.superficie,
    },

    filtroAtivo: {
      backgroundColor: c.primario,
      borderColor: c.primario,
    },

    filtroTexto: {
      fontSize: 13,
      fontWeight: '600',
      color: c.secundario,
    },

    filtroTextoAtivo: {
      color: '#FFFFFF',
    },

    /* CARD */
    cartao: {
      backgroundColor: c.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 16,
      marginBottom: 12,
    },

    cartaoPressionado: {
      opacity: 0.85,
    },

    etiqueta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: c.primarioSuave,
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 14,
    },

    etiquetaTexto: {
      flex: 1,
      fontSize: 13,
      fontWeight: '700',
      color: c.primario,
    },

    seloEncontrado: {
      backgroundColor: '#1B8A4B',
      borderRadius: 999,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },

    seloTexto: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    autor: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },

    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.primarioSuave,
      borderWidth: 2,
      borderColor: c.acento,
      alignItems: 'center',
      justifyContent: 'center',
    },

    avatarLetra: {
      fontSize: 15,
      fontWeight: '800',
      color: c.primario,
    },

    autorTextos: {
      flex: 1,
    },

    autorNome: {
      fontSize: 14,
      fontWeight: '700',
      color: c.texto,
    },

    autorInfo: {
      fontSize: 12,
      color: c.secundario,
    },

    data: {
      fontSize: 12,
      color: c.secundario,
    },

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    },

    texto: {
      flex: 1,
      fontSize: 14,
      color: c.texto,
    },

    negrito: {
      fontWeight: '700',
    },

    observacao: {
      fontSize: 13,
      lineHeight: 19,
      color: c.secundario,
      marginTop: 10,
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
  });