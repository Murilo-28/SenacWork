
import { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import Header from '../components/Header';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type Usuario = {
  nome: string;
  email: string;
  senha: string;
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar() {
    if (carregando) return;

    setMensagem('');

    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      setMensagem('Preencha o e-mail e a senha.');
      return;
    }

    try {
      setCarregando(true);

      const dados = await AsyncStorage.getItem('usuarios');
      const usuarios: Usuario[] = dados ? JSON.parse(dados) : [];

      const usuarioEncontrado = usuarios.find(
        (usuario) =>
          usuario.email.trim().toLowerCase() === emailLimpo &&
          usuario.senha === senha
      );

      if (!usuarioEncontrado) {
        setMensagem(
          'E-mail ou senha incorretos. Verifique seus dados ou cadastre-se.'
        );
        return;
      }

      await AsyncStorage.setItem(
        'usuarioLogado',
        JSON.stringify({
          nome: usuarioEncontrado.nome,
          email: usuarioEncontrado.email,
        })
      );

      router.replace('/home');
    } catch (erro) {
      console.error('Erro ao entrar:', erro);
      setMensagem('Não foi possível verificar seus dados.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header showMenu={false} showProfile={false} />

      <ScrollView
        contentContainerStyle={styles.scrollConteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>
            Bem-vindo ao{'\n'}
            Achados e Perdidos{'\n'}
            do SENAC
          </Text>

          <View style={styles.formulario}>
            <Text style={styles.subtitulo}>Login</Text>

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#888888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!carregando}
              returnKeyType="next"
            />

            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              placeholderTextColor="#888888"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              editable={!carregando}
              returnKeyType="done"
              onSubmitEditing={entrar}
            />

            {mensagem !== '' && (
              <Text style={styles.erro}>{mensagem}</Text>
            )}

            <Pressable
              style={[
                styles.botao,
                carregando && styles.botaoDesativado,
              ]}
              onPress={entrar}
              disabled={carregando}
            >
              <Text style={styles.textoBotao}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </Text>
            </Pressable>

            <Text style={styles.textoCadastro}>
              Ainda não tem uma conta?
            </Text>

            <Pressable
              onPress={() => router.push('/cadastro')}
              disabled={carregando}
            >
              <Text style={styles.link}>Cadastre-se</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollConteudo: {
    flexGrow: 1,
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: '9%',
    paddingVertical: 24,
  },

  titulo: {
    fontSize: 21,
    color: '#111111',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 27,
  },

  formulario: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 6,
    padding: 16,
    paddingTop: 20,
  },

  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 22,
    color: '#111111',
  },

  label: {
    fontSize: 12,
    color: '#333333',
    marginBottom: 6,
  },

  input: {
    width: '100%',
    height: 44,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 13,
    color: '#111111',
    backgroundColor: '#FFFFFF',
  },

  erro: {
    color: '#D32F2F',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },

  botao: {
    height: 44,
    backgroundColor: '#00549A',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 22,
  },

  botaoDesativado: {
    opacity: 0.6,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  textoCadastro: {
    color: '#333333',
    fontSize: 12,
    textAlign: 'center',
  },

  link: {
    color: '#0000FF',
    fontSize: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
});
