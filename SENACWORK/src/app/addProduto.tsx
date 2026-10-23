import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

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

type Campo = 'nome' | 'categoria' | 'local' | 'data' | 'descricao';

export default function AdicionarProduto() {
  const { modoEscuro } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [focado, setFocado] = useState<Campo | null>(null);

  async function escolherFoto() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.4,
      });

      if (!resultado.canceled) {
        setFoto(resultado.assets[0].uri);
      }
    } catch (erro) {
      console.log('Erro ao escolher foto:', erro);
      setMensagem('Não foi possível abrir a galeria.');
    }
  }

  async function cadastrarProduto() {
    if (salvando) return;

    setMensagem('');

    if (!nome.trim() || !categoria.trim() || !local.trim() || !data.trim()) {
      setMensagem('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSalvando(true);

      const novoProduto = {
        id: Date.now(),
        nome: nome.trim(),
        categoria: categoria.trim(),
        local: local.trim(),
        data: data.trim(),
        descricao: descricao.trim(),
        foto,
        status: 'perdido',
      };

      const produtosSalvos = await AsyncStorage.getItem('produtosPerdidos');
      const produtos = produtosSalvos ? JSON.parse(produtosSalvos) : [];

      // Coloca o produto novo primeiro
      produtos.unshift(novoProduto);

      await AsyncStorage.setItem('produtosPerdidos', JSON.stringify(produtos));

      router.replace('/home');
    } catch (erro) {
      console.log('Erro ao cadastrar produto:', erro);
      setMensagem('Não foi possível cadastrar o produto.');
    } finally {
      setSalvando(false);
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
        <Text style={styles.titulo}>Adicionar item perdido</Text>
        <Text style={styles.subtitulo}>
          Informe os dados do objeto que você perdeu.
        </Text>
      </View>

      <View style={styles.formulario}>
        <Text style={styles.label}>Nome do objeto *</Text>
        <TextInput
          style={estiloInput('nome')}
          placeholder="Ex: Garrafa azul"
          placeholderTextColor={cores.secundario}
          value={nome}
          onChangeText={setNome}
          onFocus={() => setFocado('nome')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Categoria *</Text>
        <TextInput
          style={estiloInput('categoria')}
          placeholder="Ex: Material escolar"
          placeholderTextColor={cores.secundario}
          value={categoria}
          onChangeText={setCategoria}
          onFocus={() => setFocado('categoria')}
          onBlur={() => setFocado(null)}
          returnKeyType="next"
        />

        <Text style={styles.label}>Local onde perdeu *</Text>
        <TextInput
          style={estiloInput('local')}
          placeholder="Ex: Sala 203"
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

        <Text style={styles.label}>Descrição</Text>
        <TextInput
          style={[...estiloInput('descricao'), styles.descricao]}
          placeholder="Descreva o objeto..."
          placeholderTextColor={cores.secundario}
          multiline
          value={descricao}
          onChangeText={setDescricao}
          onFocus={() => setFocado('descricao')}
          onBlur={() => setFocado(null)}
        />

        {foto ? (
          <View style={styles.fotoBloco}>
            <Image source={{ uri: foto }} style={styles.fotoPreview} />

            <View style={styles.fotoAcoes}>
              <Pressable onPress={escolherFoto} hitSlop={8}>
                <Text style={styles.fotoAcao}>Trocar foto</Text>
              </Pressable>
              <Pressable onPress={() => setFoto(null)} hitSlop={8}>
                <Text style={[styles.fotoAcao, styles.fotoRemover]}>
                  Remover
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.botaoFoto,
              pressed && styles.botaoPressionado,
            ]}
            onPress={escolherFoto}
          >
            <Ionicons name="camera-outline" size={20} color={cores.primario} />
            <Text style={styles.textoBotaoFoto}>Adicionar foto</Text>
          </Pressable>
        )}

        {mensagem !== '' && (
          <View style={styles.caixaErro}>
            <Text style={styles.erro}>{mensagem}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.botaoCadastrar,
            pressed && styles.botaoPressionado,
            salvando && styles.botaoDesativado,
          ]}
          onPress={cadastrarProduto}
          disabled={salvando}
        >
          <Text style={styles.textoBotaoCadastrar}>
            {salvando ? 'Salvando...' : 'Cadastrar item perdido'}
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

    descricao: {
      height: undefined,
      minHeight: 110,
      paddingTop: 14,
      textAlignVertical: 'top',
    },

    botaoFoto: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: c.primario,
      backgroundColor: c.primarioSuave,
      borderRadius: 12,
      marginBottom: 14,
    },

    textoBotaoFoto: {
      color: c.primario,
      fontSize: 14,
      fontWeight: '700',
    },

    fotoBloco: {
      marginBottom: 14,
    },

    fotoPreview: {
      width: '100%',
      aspectRatio: 4 / 3,
      borderRadius: 12,
      backgroundColor: c.primarioSuave,
    },

    fotoAcoes: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 24,
      marginTop: 10,
    },

    fotoAcao: {
      fontSize: 13,
      fontWeight: '700',
      color: c.primario,
    },

    fotoRemover: {
      color: '#D32F2F',
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

    botaoCadastrar: {
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

    textoBotaoCadastrar: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });