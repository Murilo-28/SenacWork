import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
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

const cores = {
  fundo: '#F4F7FB',
  cartao: '#FFFFFF',
  texto: '#0F1B2D',
  secundario: '#6B7A90',
  borda: '#E3E9F1',
  input: '#F4F7FB',
  primario: '#00549A',
  primarioSuave: '#E6F0FA',
  acento: '#F7941D',
  erro: '#D32F2F',
  erroFundo: '#FDECEC',
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [focado, setFocado] = useState<'email' | 'senha' | null>(null);

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
      behavior="padding"
    >
      <Header showMenu={false} showProfile={false} />

      <ScrollView
        contentContainerStyle={styles.scrollConteudo}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudo}>
          <View style={styles.cabecalho}>
            <View style={styles.selo}>
              <Text style={styles.seloTexto}>SENAC</Text>
            </View>
            <Text style={styles.titulo}>Achados e Perdidos</Text>
            <Text style={styles.descricao}>
              Encontre o que você perdeu ou devolva o que achou.
            </Text>
          </View>

          <View style={styles.cartao}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={[styles.input, focado === 'email' && styles.inputFocado]}
              placeholder="seu@email.com"
              placeholderTextColor="#A3AFC0"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocado('email')}
              onBlur={() => setFocado(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!carregando}
              returnKeyType="next"
            />

            <Text style={styles.label}>Senha</Text>
            <View style={styles.campoSenha}>
              <TextInput
                style={[
                  styles.input,
                  styles.inputSenha,
                  focado === 'senha' && styles.inputFocado,
                ]}
                placeholder="••••••••"
                placeholderTextColor="#A3AFC0"
                value={senha}
                onChangeText={setSenha}
                onFocus={() => setFocado('senha')}
                onBlur={() => setFocado(null)}
                secureTextEntry={!mostrarSenha}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!carregando}
                returnKeyType="done"
                onSubmitEditing={entrar}
              />

              <Pressable
                style={styles.olho}
                onPress={() => setMostrarSenha((v) => !v)}
                hitSlop={8}
                accessibilityLabel={
                  mostrarSenha ? 'Esconder senha' : 'Mostrar senha'
                }
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={cores.secundario}
                />
              </Pressable>
            </View>

            {mensagem !== '' && (
              <View style={styles.caixaErro}>
                <Text style={styles.erro}>{mensagem}</Text>
              </View>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.botao,
                pressed && styles.botaoPressionado,
                carregando && styles.botaoDesativado,
              ]}
              onPress={entrar}
              disabled={carregando}
            >
              <Text style={styles.textoBotao}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.rodape}>
            <Text style={styles.textoCadastro}>Ainda não tem uma conta?</Text>
            <Pressable
              onPress={() => router.push('/cadastro')}
              disabled={carregando}
              hitSlop={8}
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
    backgroundColor: cores.fundo,
  },

  scrollConteudo: {
    flexGrow: 1,
    paddingBottom: 24,
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  cabecalho: {
    marginBottom: 28,
  },

  selo: {
    alignSelf: 'flex-start',
    backgroundColor: cores.primarioSuave,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: cores.acento,
  },

  seloTexto: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: cores.primario,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: cores.texto,
    lineHeight: 36,
    letterSpacing: -0.5,
  },

  descricao: {
    fontSize: 14,
    color: cores.secundario,
    marginTop: 8,
    lineHeight: 20,
  },

  cartao: {
    width: '100%',
    backgroundColor: cores.cartao,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: cores.borda,
    shadowColor: '#0F1B2D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
  },

  label: {
    fontSize: 12,
    fontWeight: '600',
    color: cores.secundario,
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 50,
    borderWidth: 1.5,
    borderColor: cores.borda,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 18,
    fontSize: 15,
    color: cores.texto,
    backgroundColor: cores.input,
  },

  inputFocado: {
    borderColor: cores.primario,
    backgroundColor: cores.cartao,
  },

  campoSenha: {
    marginBottom: 18,
  },

  inputSenha: {
    marginBottom: 0,
    paddingRight: 48,
  },

  olho: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 48,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  caixaErro: {
    backgroundColor: cores.erroFundo,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  erro: {
    color: cores.erro,
    fontSize: 13,
    lineHeight: 18,
  },

  botao: {
    height: 52,
    backgroundColor: cores.primario,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: cores.primario,
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

  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 26,
  },

  textoCadastro: {
    color: cores.secundario,
    fontSize: 13,
  },

  link: {
    color: cores.primario,
    fontSize: 13,
    fontWeight: '700',
  },
});