import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTema } from '../contexts/ThemeContext';


export default function Home() {

  const {
    modoEscuro,
  } = useTema();


  return (

    <View
      style={[
        styles.container,

        {
          backgroundColor:
            modoEscuro
              ? '#061A36'
              : '#FFFFFF',
        },
      ]}
    >


      <Text
        style={[
          styles.titulo,

          {
            color:
              modoEscuro
                ? '#FFFFFF'
                : '#000000',
          },
        ]}
      >
        Home
      </Text>


      <Text
        style={[
          styles.texto,

          {
            color:
              modoEscuro
                ? '#B8C7D9'
                : '#555555',
          },
        ]}
      >
        Achados e Perdidos SENAC
      </Text>


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

});