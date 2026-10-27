import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';
import {
  carregarItens,
  carregarMensagens,
  salvarMensagem,
  type Item,
  type Mensagem,
} from '../lib/itens';

type Campo = 'encontrou' | 'deixou' | 'obs';

export default function ItemScreen() {
  const { chave } = useLocalSearchParams<{ chave: string }>();
  const { modoEscuro } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [item, setItem] = useState<Item | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [usuario, setUsuario] = useState<{ nome: string; email: string } | null>(
    null
  );

  const [ondeEncontrou, setOndeEncontrou] = useState('');
  const [ondeDeixou, setOndeDeixou] = useState('');
  const [observacao, setObservacao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [focado, setFocado] = useState<Campo | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const itens = await carregarItens();
        const todas = await carregarMensagens();
        const logado = await AsyncStorage.getItem('usuarioLogado');

        setItem(itens.find((i) => i.chave === chave) ?? null);
        setMensagens(todas.filter((m) => m.chave === chave));
        setUsuario(logado ? JSON.parse(logado) : null);
        setCarregado(true);
      }

      carregar();
    }, [chave])
  );

  async function enviar() {
    if (enviando || !chave) return;

    setErro('');
    setSucesso('');

    if (!ondeEncontrou.trim() || !ondeDeixou.trim()) {
      setErro('Diga onde encontrou e onde vai deixar o item.');
      return;
    }

    try {
      setEnviando(true);

      const nova: Mensagem = {
        id: Date.now(),
        chave,
        autorNome: usuario?.nome ?? 'Alguém',
        autorEmail: usuario?.email ?? '',
        ondeEncontrou: ondeEncontrou.trim(),
        ondeDeixou: ondeDeixou.trim(),
        observacao: observacao.trim(),
        criadaEm: new Date().toLocaleDateString('pt-BR'),
      };

      await salvarMensagem(nova);

      setMensagens((atual) => [nova, ...atual]);
      setOndeEncontrou('');
      setOndeDeixou('');
      setObservacao('');
      setSucesso('Mensagem enviada. Obrigado por ajudar!');
    } catch (e) {
      console.log('Erro ao enviar mensagem:', e);
      setErro('Não foi possível enviar a mensagem.');
    } finally {
      setEnviando(false);
    }
  }

  function estiloInput(campo: Campo) {
    return [styles.input, focado === campo && styles.inputFocado];
  }

  const voltar = (
    <Pressable style={styles.voltar} onPress={() => router.back()} hitSlop={8}>
      <Ionicons name="arrow-back" size={18} color={cores.primario} />
      <Text style={styles.voltarTexto}>Voltar</Text>
    </Pressable>
  );

  if (carregado && !item) {
    return (
      <View style={[styles.container, styles.conteudo]}>
        {voltar}
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>Item não encontrado.</Text>
        </View>
      </View>
    );
  }

  if (!item) {
    return <View style={styles.container} />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {voltar}

      {/* ITEM */}
      <View style={styles.cartao}>
        {item.foto && (
          <Image source={{ uri: item.foto }} style={styles.foto} />
        )}

        <Text style={styles.titulo}>{item.titulo}</Text>

        <View style={styles.linha}>
          <Ionicons
            name="location-outline"
            size={16}
            color={cores.secundario}
          />
          <Text style={styles.info}>
            {item.local} · {item.data}
          </Text>
        </View>

        {item.categoria ? (
          <View style={styles.linha}>
            <Ionicons name="pricetag-outline" size={16} color={cores.secundario} />
            <Text style={styles.info}>{item.categoria}</Text>
          </View>
        ) : null}

        {item.autor ? (
          <View style={styles.linha}>
            <Ionicons name="person-outline" size={16} color={cores.secundario} />
            <Text style={styles.info}>Solicitado por {item.autor}</Text>
          </View>
        ) : null}

        {item.detalhes ? (
          <Text style={styles.detalhes}>{item.detalhes}</Text>
        ) : null}
      </View>

      {/* MENSAGENS */}
      <Text style={styles.secao}>MENSAGENS ({mensagens.length})</Text>

      {mensagens.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>
            Ninguém respondeu ainda. Se você encontrou, avise abaixo.
          </Text>
        </View>
      ) : (
        mensagens.map((m) => (
          <View key={m.id} style={styles.mensagem}>
            <View style={styles.mensagemTopo}>
              <Text style={styles.mensagemAutor}>{m.autorNome}</Text>
              <Text style={styles.mensagemData}>{m.criadaEm}</Text>
            </View>

            <View style={styles.linha}>
              <Ionicons name="locate-outline" size={16} color={cores.primario} />
              <Text style={styles.mensagemTexto}>
                Encontrado em: <Text style={styles.negrito}>{m.ondeEncontrou}</Text>
              </Text>
            </View>

            <View style={styles.linha}>
              <Ionicons name="cube-outline" size={16} color={cores.primario} />
              <Text style={styles.mensagemTexto}>
                Deixado em: <Text style={styles.negrito}>{m.ondeDeixou}</Text>
              </Text>
            </View>

            {m.observacao ? (
              <Text style={styles.observacao}>{m.observacao}</Text>
            ) : null}
          </View>
        ))
      )}

      {/* FORMULÁRIO */}
      <Text style={styles.secao}>ENCONTROU ESTE ITEM?</Text>

      <View style={styles.cartao}>
        <Text style={styles.label}>Onde você encontrou? *</Text>
        <TextInput
          style={estiloInput('encontrou')}
          placeholder="Ex: Corredor do 2º andar"
          placeholderTextColor={cores.secundario}
          value={ondeEncontrou}
          onChangeText={setOndeEncontrou}
          onFocus={() => setFocado('encontrou')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Onde você vai deixar o item? *</Text>
        <TextInput
          style={estiloInput('deixou')}
          placeholder="Ex: Recepção do SENAC"
          placeholderTextColor={cores.secundario}
          value={ondeDeixou}
          onChangeText={setOndeDeixou}
          onFocus={() => setFocado('deixou')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Observação</Text>
        <TextInput
          style={[...estiloInput('obs'), styles.obs]}
          placeholder="Algo mais que ajude o dono a achar..."
          placeholderTextColor={cores.secundario}
          multiline
          value={observacao}
          onChangeText={setObservacao}
          onFocus={() => setFocado('obs')}
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
            enviando && styles.botaoDesativado,
          ]}
          onPress={enviar}
          disabled={enviando}
        >
          <Text style={styles.textoBotao}>
            {enviando ? 'Enviando...' : 'Enviar mensagem'}
          </Text>
        </Pressable>
      </View>
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
      paddingTop: 20,
      paddingBottom: 40,
    },

    voltar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      marginBottom: 16,
    },

    voltarTexto: {
      fontSize: 14,
      fontWeight: '600',
      color: c.primario,
    },

    cartao: {
      backgroundColor: c.superficie,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 20,
    },

    foto: {
      width: '100%',
      aspectRatio: 4 / 3,
      borderRadius: 12,
      backgroundColor: c.primarioSuave,
      marginBottom: 16,
    },

    titulo: {
      fontSize: 22,
      fontWeight: '800',
      letterSpacing: -0.3,
      color: c.texto,
      marginBottom: 10,
    },

    linha: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    },

    info: {
      flex: 1,
      fontSize: 14,
      color: c.secundario,
    },

    detalhes: {
      fontSize: 14,
      lineHeight: 20,
      color: c.texto,
      marginTop: 14,
    },

    secao: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2,
      color: c.secundario,
      marginTop: 28,
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
      textAlign: 'center',
    },

    mensagem: {
      backgroundColor: c.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 16,
      marginBottom: 12,
    },

    mensagemTopo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },

    mensagemAutor: {
      fontSize: 14,
      fontWeight: '700',
      color: c.texto,
    },

    mensagemData: {
      fontSize: 12,
      color: c.secundario,
    },

    mensagemTexto: {
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

    obs: {
      height: undefined,
      minHeight: 90,
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
  });