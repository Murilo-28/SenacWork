import { router } from 'expo-router';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTema } from '../contexts/ThemeContext';


export default function Home() {

  const { modoEscuro } = useTema();

  function adicionarProduto() {
    router.push('/addProduto');
  }


  return (

    <View
      style={[
        styles.container,
        {
          backgroundColor: modoEscuro
            ? '#061A36'
            : '#FFFFFF',
        },
      ]}
    >

      {/* TÍTULO */}

      <Text
        style={[
          styles.titulo,
          {
            color: modoEscuro
              ? '#FFFFFF'
              : '#000000',
          },
        ]}
      >
        Home
      </Text>


      {/* SUBTÍTULO */}

      <Text
        style={[
          styles.texto,
          {
            color: modoEscuro
              ? '#B8C7D9'
              : '#555555',
          },
        ]}
      >
        Achados e Perdidos SENAC
      </Text>


      {/* BOTÃO ADICIONAR PRODUTO */}

      <Pressable
        style={({ pressed }) => [
          styles.botaoAdicionar,
          pressed && styles.botaoPressionado,
        ]}
        onPress={adicionarProduto}
      >
        <Text style={styles.mais}>
          +
        </Text>
      </Pressable>

    </View>

  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },


  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },


  texto: {
    fontSize: 16,
  },


  /* BOTÃO + */

  botaoAdicionar: {
    position: 'absolute',

    right: 25,
    bottom: 25,

    width: 65,
    height: 65,

    borderRadius: 33,

    backgroundColor: '#F7941D',

    alignItems: 'center',
    justifyContent: 'center',

    elevation: 8,

    shadowColor: '#000000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.3,

    shadowRadius: 5,
  },


  botaoPressionado: {
    opacity: 0.7,
  },


  mais: {
    color: '#FFFFFF',

    fontSize: 42,

    fontWeight: '300',

    lineHeight: 45,
  },

});