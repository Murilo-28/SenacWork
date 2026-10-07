import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Bem-vindo ao Achados e Perdidos do SENAC
      </Text>

      <Text style={styles.login}>
        Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Nome"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
      />

      <Pressable style={styles.botao}>
        <Text style={styles.textoBotao}>
          Entrar
        </Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },

  login: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  botao: {
    backgroundColor: '#6D28D9',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  textoBotao: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});