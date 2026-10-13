import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.conteudo}>

        <Text style={styles.titulo}>
          Bem-Vindo ao
          {'\n'}Achados e Perdidos
          {'\n'}do Senac
        </Text>

        <View style={styles.formulario}>

          <Text style={styles.subtitulo}>Login</Text>

          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          <Pressable style={styles.botao}>
            <Text style={styles.textoBotao}>Entrar</Text>
          </Pressable>

          <Text style={styles.textoCadastro}>
            Ainda não tem uma conta?
          </Text>

          <Pressable onPress={() => router.push('/cadastro')}>
            <Text style={styles.link}>Cadastre-se</Text>
          </Pressable>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  conteudo: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: '9%',
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
    height: 40,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 16,
    fontSize: 13,
  },

  botao: {
    height: 40,
    backgroundColor: '#00549A',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 22,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
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