import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';

type Campo = 'item' | 'local' | 'data' | 'contato' | 'detalhes';

type Solicitacao = {
  id: number;
  usuarioEmail: string;
  usuarioNome: string;
  item: string;
  local: string;
  data: string;
  contato: string;
  detalhes: string;
  status: 'pendente';
  criadaEm: string;
};

export default function SolicitacaoScreen() {
  const { modoEscuro } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [item, setItem] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [contato, setContato] = useState('');
  const [detalhes, setDetalhes] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [focado, setFocado] = useState<Campo | null>(null);

  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(
    null
  );
  const [minhas, setMinhas] = useState<Solicitacao[]>([]);

  // Carrega o usuário logado e as solicitações dele
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const logado = await AsyncStorage.getItem('usuarioLogado');
          const user = logado ? JSON.parse(logado) : null;
          setUsuario(user);

          const dados = await AsyncStorage.getItem('solicitacoes');
          const todas: Solicitacao[] = dados ? JSON.parse(dados) : [];

          setMinhas(
            user ? todas.filter((s) => s.usuarioEmail === user.email) : []
          );
        } catch (e) {
          console.log('Erro ao carregar solicitações:', e);
        }
      }

      carregar();
    }, [])
  );

  async function enviar() {
    if (salvando) return;

    setErro('');
    setSucesso('');

    if (!item.trim() || !local.trim() || !data.trim() || !contato.trim()) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSalvando(true);

      const nova: Solicitacao = {
        id: Date.now(),
        usuarioEmail: usuario?.email ?? '',
        usuarioNome: usuario?.nome ?? '',
        item: item.trim(),
        local: local.trim(),
        data: data.trim(),
        contato: contato.trim(),
        detalhes: detalhes.trim(),
        status: 'pendente',
        criadaEm: new Date().toLocaleDateString('pt-BR'),
      };

      const dados = await AsyncStorage.getItem('solicitacoes');
      const todas: Solicitacao[] = dados ? JSON.parse(dados) : [];

      todas.unshift(nova);

      await AsyncStorage.setItem('solicitacoes', JSON.stringify(todas));

      setMinhas((atual) => [nova, ...atual]);

      setItem('');
      setLocal('');
      setData('');
      setContato('');
      setDetalhes('');
      setSucesso('Solicitação enviada com sucesso!');
    } catch (e) {
      console.log('Erro ao enviar solicitação:', e);
      setErro('Não foi possível enviar a solicitação.');
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: number) {
    try {
      const dados = await AsyncStorage.getItem('solicitacoes');
      const todas: Solicitacao[] = dados ? JSON.parse(dados) : [];

      await AsyncStorage.setItem(
        'solicitacoes',
        JSON.stringify(todas.filter((s) => s.id !== id))
      );

      setMinhas((atual) => atual.filter((s) => s.id !== id));
    } catch (e) {
      console.log('Erro ao remover solicitação:', e);
    }
  }

  function estiloInput(campo: Campo) {
    return [styles.input, focado === campo && styles.inputFocado];
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Solicitar item perdido</Text>
        <Text style={styles.subtitulo}>
          Descreva o que você perdeu para registrarmos sua solicitação.
        </Text>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.label}>O que você perdeu? *</Text>
        <TextInput
          style={estiloInput('item')}
          placeholder="Ex: Carteira preta"
          placeholderTextColor={cores.secundario}
          value={item}
          onChangeText={setItem}
          onFocus={() => setFocado('item')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Local provável *</Text>
        <TextInput
          style={estiloInput('local')}
          placeholder="Ex: Biblioteca ou sala 203"
          placeholderTextColor={cores.secundario}
          value={local}
          onChangeText={setLocal}
          onFocus={() => setFocado('local')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Data em que perdeu *</Text>
        <TextInput
          style={estiloInput('data')}
          placeholder="Ex: 15/10/2026"
          placeholderTextColor={cores.secundario}
          value={data}
          onChangeText={setData}
          onFocus={() => setFocado('data')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Contato (telefone ou WhatsApp) *</Text>
        <TextInput
          style={estiloInput('contato')}
          placeholder="(54) 99999-9999"
          placeholderTextColor={cores.secundario}
          value={contato}
          onChangeText={setContato}
          onFocus={() => setFocado('contato')}
          onBlur={() => setFocado(null)}
          keyboardType="phone-pad"
          returnKeyType="next"
        />

        <Text style={styles.label}>Detalhes</Text>
        <TextInput
          style={[...estiloInput('detalhes'), styles.detalhes]}
          placeholder="Cor, marca, marcas de uso, o que tinha dentro..."
          placeholderTextColor={cores.secundario}
          multiline
          value={detalhes}
          onChangeText={setDetalhes}
          onFocus={() => setFocado('detalhes')}
          onBlur={() => setFocado(null)}
        />

        {erro !== '' && (
          <View style={styles.caixaErro}>
            <Text style={styles.erro}>{erro}</Text>
          </View>
        )}

        {sucesso !== '' && (
          <View style={styles.caixaSucesso}>
            <Text style={styles.sucesso}>{sucesso}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
            salvando && styles.botaoDesativado,
          ]}
          onPress={enviar}
          disabled={salvando}
        >
          <Text style={styles.textoBotao}>
            {salvando ? 'Enviando...' : 'Enviar solicitação'}
          </Text>
        </Pressable>
      </View>

      <Text style={styles.secao}>MINHAS SOLICITAÇÕES</Text>

      {minhas.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>
            Você ainda não fez nenhuma solicitação.
          </Text>
        </View>
      ) : (
        minhas.map((s) => (
          <View key={s.id} style={styles.cartaoItem}>
            <View style={styles.itemTopo}>
              <Text style={styles.itemNome} numberOfLines={1}>
                {s.item}
              </Text>
              <View style={styles.status}>
                <Text style={styles.statusTexto}>Pendente</Text>
              </View>
            </View>

            <Text style={styles.itemInfo}>
              {s.local} · {s.data}
            </Text>

            <View style={styles.itemRodape}>
              <Text style={styles.itemData}>Enviada em {s.criadaEm}</Text>
              <Pressable onPress={() => remover(s.id)} hitSlop={8}>
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color={cores.secundario}
                />
              </Pressable>
            </View>
          </View>
        ))
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
      marginBottom: 24,
    },

    titulo: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: c.texto,
    },

    subtitulo: {
      fontSize: 14,
      color: c.secundario,
      marginTop: 6,
      lineHeight: 20,
    },

    formulario: {
      backgroundColor: c.superficie,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 22,
    },

    label: {
      fontSize: 12,
      fontWeight: '600',
      color: c.secundario,
      marginBottom: 8,
    },

    input: {
      width: '100%',
      height: 50,
      borderWidth: 1.5,
      borderColor: c.borda,
      borderRadius: 12,
      paddingHorizontal: 14,
      marginBottom: 18,
      fontSize: 15,
      color: c.texto,
      backgroundColor: c.fundo,
    },

    inputFocado: {
      borderColor: c.primario,
      backgroundColor: c.superficie,
    },

    detalhes: {
      height: undefined,
      minHeight: 100,
      paddingTop: 14,
      textAlignVertical: 'top',
    },

    caixaErro: {
      backgroundColor: '#FDECEC',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 14,
    },

    erro: {
      color: '#D32F2F',
      fontSize: 13,
      lineHeight: 18,
    },

    caixaSucesso: {
      backgroundColor: '#E8F6EE',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 14,
    },

    sucesso: {
      color: '#1B8A4B',
      fontSize: 13,
      lineHeight: 18,
    },

    botao: {
      height: 52,
      backgroundColor: c.primario,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.primario,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
    },

    botaoPressionado: {
      opacity: 0.88,
      transform: [{ scale: 0.985 }],
    },

    botaoDesativado: {
      opacity: 0.6,
    },

    textoBotao: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    secao: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2,
      color: c.secundario,
      marginTop: 32,
      marginBottom: 12,
      marginLeft: 4,
    },

    vazio: {
      backgroundColor: c.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 20,
      alignItems: 'center',
    },

    textoVazio: {
      fontSize: 13,
      color: c.secundario,
    },

    cartaoItem: {
      backgroundColor: c.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 16,
      marginBottom: 12,
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
      justifyContent: 'space-between',
      marginTop: 12,
    },

    itemData: {
      fontSize: 12,
      color: c.secundario,
    },

    status: {
      backgroundColor: '#FEF1DD',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },

    statusTexto: {
      fontSize: 11,
      fontWeight: '700',
      color: '#B86E00',
    },
  });