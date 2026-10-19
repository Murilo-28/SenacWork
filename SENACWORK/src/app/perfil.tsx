import { useState } from 'react';

import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useTema } from '../contexts/ThemeContext';

export default function PerfilScreen() {
  const { modoEscuro } = useTema();

  const [nome, setNome] = useState('Seu nome');
  const [email, setEmail] = useState('seuemail@email.com');
  const [editando, setEditando] = useState(false);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: modoEscuro ? '#061A36' : '#F5F5F5',
        },
      ]}
    >
      <Text
        style={[
          styles.titulo,
          { color: modoEscuro ? '#FFFFFF' : '#111111' },
        ]}
      >
        Meu perfil
      </Text>

      <View
        style={[
          styles.cartao,
          {
            backgroundColor: modoEscuro ? '#0B3456' : '#FFFFFF',
            borderColor: modoEscuro ? '#174E78' : '#E0E0E0',
          },
        ]}
      >
        <View style={styles.avatar}>
          <Text style={styles.letra}>
            {nome.trim().charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <Text
          style={[
            styles.nome,
            { color: modoEscuro ? '#FFFFFF' : '#222222' },
          ]}
        >
          {nome}
        </Text>

        <Text
          style={[
            styles.tipo,
            { color: modoEscuro ? '#B8C7D9' : '#777777' },
          ]}
        >
          Usuário do SENAC
        </Text>

        <View style={styles.divisor} />

        <Text
          style={[
            styles.label,
            { color: modoEscuro ? '#FFFFFF' : '#333333' },
          ]}
        >
          Nome
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: modoEscuro ? '#FFFFFF' : '#222222',
              backgroundColor: modoEscuro ? '#082746' : '#F8F8F8',
              borderColor: modoEscuro ? '#24577E' : '#D5D5D5',
            },
          ]}
          value={nome}
          onChangeText={setNome}
          editable={editando}
          placeholder="Digite seu nome"
          placeholderTextColor={modoEscuro ? '#91A6BA' : '#999999'}
        />

        <Text
          style={[
            styles.label,
            { color: modoEscuro ? '#FFFFFF' : '#333333' },
          ]}
        >
          E-mail
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              color: modoEscuro ? '#FFFFFF' : '#222222',
              backgroundColor: modoEscuro ? '#082746' : '#F8F8F8',
              borderColor: modoEscuro ? '#24577E' : '#D5D5D5',
            },
          ]}
          value={email}
          onChangeText={setEmail}
          editable={editando}
          placeholder="Digite seu e-mail"
          placeholderTextColor={modoEscuro ? '#91A6BA' : '#999999'}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable
          style={styles.botao}
          onPress={() => {
            if (editando) {
              setEditando(false);
              Alert.alert('Perfil', 'Alterações aplicadas nesta tela.');
            } else {
              setEditando(true);
            }
          }}
        >
          <Text style={styles.textoBotao}>
            {editando ? 'Salvar alterações' : 'Editar perfil'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  titulo: {
    fontSize: 29,
    fontWeight: 'bold',
    marginBottom: 22,
  },

  cartao: {
    borderWidth: 1,
    borderRadius: 15,
    padding: 20,
    alignItems: 'stretch',
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F7941D',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  letra: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
  },

  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tipo: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },

  divisor: {
    height: 1,
    backgroundColor: '#D5D5D5',
    marginVertical: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderRadius: 9,
    padding: 12,
    fontSize: 15,
    marginBottom: 17,
  },

  botao: {
    backgroundColor: '#F7941D',
    padding: 14,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 5,
  },

  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});