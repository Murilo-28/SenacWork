import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function AdicionarProduto() {
  const [tema, setTema] = useState<'claro' | 'escuro'>('claro');

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [local, setLocal] = useState('');
  const [data, setData] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    carregarTema();
  }, []);

  async function carregarTema() {
    try {
      const temaSalvo = await AsyncStorage.getItem('tema');

      if (temaSalvo === 'claro' || temaSalvo === 'escuro') {
        setTema(temaSalvo);
      }
    } catch (erro) {
      console.log('Erro ao carregar tema:', erro);
    }
  }

  async function cadastrarProduto() {
    if (!nome || !categoria || !local || !data) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos obrigatórios.'
      );
      return;
    }

    try {
      const novoProduto = {
        id: Date.now(),
        nome,
        categoria,
        local,
        data,
        descricao,
        status: 'perdido',
      };

      const produtosSalvos = await AsyncStorage.getItem('produtosPerdidos');

      const produtos = produtosSalvos
        ? JSON.parse(produtosSalvos)
        : [];

      produtos.push(novoProduto);

      await AsyncStorage.setItem(
        'produtosPerdidos',
        JSON.stringify(produtos)
      );

      Alert.alert(
        'Sucesso',
        'Produto perdido cadastrado!'
      );

      setNome('');
      setCategoria('');
      setLocal('');
      setData('');
      setDescricao('');
    } catch (erro) {
      console.log('Erro ao cadastrar produto:', erro);

      Alert.alert(
        'Erro',
        'Não foi possível cadastrar o produto.'
      );
    }
  }

  const escuro = tema === 'escuro';

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: escuro
            ? '#061A36'
            : '#F5F5F5',
        },
      ]}
      contentContainerStyle={styles.conteudo}
    >
      <Text
        style={[
          styles.titulo,
          {
            color: escuro
              ? '#FFFFFF'
              : '#111111',
          },
        ]}
      >
        Adicionar item perdido
      </Text>

      <Text
        style={[
          styles.subtitulo,
          {
            color: escuro
              ? '#B8C7D9'
              : '#666666',
          },
        ]}
      >
        Informe os dados do objeto que você perdeu.
      </Text>

      <View
        style={[
          styles.formulario,
          {
            backgroundColor: escuro
              ? '#0B3456'
              : '#FFFFFF',

            borderColor: escuro
              ? '#174E78'
              : '#E0E0E0',
          },
        ]}
      >
        {/* NOME */}

        <Text
          style={[
            styles.label,
            { color: escuro ? '#FFFFFF' : '#222222' },
          ]}
        >
          Nome do objeto *
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: escuro
                ? '#082746'
                : '#F8F8F8',

              color: escuro
                ? '#FFFFFF'
                : '#111111',

              borderColor: escuro
                ? '#24577E'
                : '#D5D5D5',
            },
          ]}
          placeholder="Ex: Garrafa azul"
          placeholderTextColor={
            escuro ? '#91A6BA' : '#999999'
          }
          value={nome}
          onChangeText={setNome}
        />

        {/* CATEGORIA */}

        <Text
          style={[
            styles.label,
            { color: escuro ? '#FFFFFF' : '#222222' },
          ]}
        >
          Categoria *
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: escuro
                ? '#082746'
                : '#F8F8F8',

              color: escuro
                ? '#FFFFFF'
                : '#111111',

              borderColor: escuro
                ? '#24577E'
                : '#D5D5D5',
            },
          ]}
          placeholder="Ex: Material escolar"
          placeholderTextColor={
            escuro ? '#91A6BA' : '#999999'
          }
          value={categoria}
          onChangeText={setCategoria}
        />

        {/* LOCAL */}

        <Text
          style={[
            styles.label,
            { color: escuro ? '#FFFFFF' : '#222222' },
          ]}
        >
          Local onde perdeu *
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: escuro
                ? '#082746'
                : '#F8F8F8',

              color: escuro
                ? '#FFFFFF'
                : '#111111',

              borderColor: escuro
                ? '#24577E'
                : '#D5D5D5',
            },
          ]}
          placeholder="Ex: Sala 203"
          placeholderTextColor={
            escuro ? '#91A6BA' : '#999999'
          }
          value={local}
          onChangeText={setLocal}
        />

        {/* DATA */}

        <Text
          style={[
            styles.label,
            { color: escuro ? '#FFFFFF' : '#222222' },
          ]}
        >
          Data em que perdeu *
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: escuro
                ? '#082746'
                : '#F8F8F8',

              color: escuro
                ? '#FFFFFF'
                : '#111111',

              borderColor: escuro
                ? '#24577E'
                : '#D5D5D5',
            },
          ]}
          placeholder="Ex: 15/10/2026"
          placeholderTextColor={
            escuro ? '#91A6BA' : '#999999'
          }
          value={data}
          onChangeText={setData}
        />

        {/* DESCRIÇÃO */}

        <Text
          style={[
            styles.label,
            { color: escuro ? '#FFFFFF' : '#222222' },
          ]}
        >
          Descrição
        </Text>

        <TextInput
          style={[
            styles.input,
            styles.descricao,
            {
              backgroundColor: escuro
                ? '#082746'
                : '#F8F8F8',

              color: escuro
                ? '#FFFFFF'
                : '#111111',

              borderColor: escuro
                ? '#24577E'
                : '#D5D5D5',
            },
          ]}
          placeholder="Descreva o objeto..."
          placeholderTextColor={
            escuro ? '#91A6BA' : '#999999'
          }
          multiline
          value={descricao}
          onChangeText={setDescricao}
        />

        {/* FOTO */}

        <Pressable style={styles.botaoFoto}>
          <Text style={styles.textoBotaoFoto}>
            + Adicionar foto
          </Text>
        </Pressable>

        {/* CADASTRAR */}

        <Pressable
          style={styles.botaoCadastrar}
          onPress={cadastrarProduto}
        >
          <Text style={styles.textoBotaoCadastrar}>
            Cadastrar item perdido
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  conteudo: {
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 40,
  },

  titulo: {
    fontSize: 29,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 25,
  },

  formulario: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 18,
  },

  descricao: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  botaoFoto: {
    borderWidth: 2,
    borderColor: '#F7941D',
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 13,
  },

  textoBotaoFoto: {
    color: '#F7941D',
    fontSize: 15,
    fontWeight: 'bold',
  },

  botaoCadastrar: {
    backgroundColor: '#F7941D',
    borderRadius: 9,
    paddingVertical: 15,
    alignItems: 'center',
  },

  textoBotaoCadastrar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
