import { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Config() {

  const [tema, setTema] = useState('claro');

  // Carrega o tema que estava salvo
  useEffect(() => {
    carregarTema();
  }, []);

  async function carregarTema() {
    try {
      const temaSalvo = await AsyncStorage.getItem('tema');

      if (temaSalvo) {
        setTema(temaSalvo);
      }
    } catch (erro) {
      console.log('Erro ao carregar tema:', erro);
    }
  }

  // Troca o tema e salva
  async function mudarTema(novoTema: string) {
    try {
      setTema(novoTema);

      await AsyncStorage.setItem('tema', novoTema);
    } catch (erro) {
      console.log('Erro ao salvar tema:', erro);
    }
  }

  const modoEscuro = tema === 'escuro';

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
        Configurações
      </Text>


      {/* MODO */}
      <Text
        style={[
          styles.modo,
          {
            color: modoEscuro
              ? '#FFFFFF'
              : '#000000',
          },
        ]}
      >
        Modo:
      </Text>


      {/* OPÇÃO CLARO */}
      <Pressable
        style={styles.opcao}
        onPress={() => mudarTema('claro')}
      >

        <Text
          style={[
            styles.bolinha,
            {
              color: modoEscuro
                ? '#FFFFFF'
                : '#000000',
            },
          ]}
        >
          {tema === 'claro' ? '◉' : '○'}
        </Text>

        <View>

          <Text
            style={[
              styles.nomeOpcao,
              {
                color: modoEscuro
                  ? '#FFFFFF'
                  : '#333333',
              },
            ]}
          >
            Claro
          </Text>

          <Text
            style={[
              styles.descricao,
              {
                color: modoEscuro
                  ? '#B8C7D9'
                  : '#777777',
              },
            ]}
          >
            Um modo claro
          </Text>

        </View>

      </Pressable>


      {/* OPÇÃO ESCURO */}
      <Pressable
        style={styles.opcao}
        onPress={() => mudarTema('escuro')}
      >

        <Text
          style={[
            styles.bolinha,
            {
              color: modoEscuro
                ? '#FFFFFF'
                : '#000000',
            },
          ]}
        >
          {tema === 'escuro' ? '◉' : '○'}
        </Text>

        <View>

          <Text
            style={[
              styles.nomeOpcao,
              {
                color: modoEscuro
                  ? '#FFFFFF'
                  : '#333333',
              },
            ]}
          >
            Escuro
          </Text>

          <Text
            style={[
              styles.descricao,
              {
                color: modoEscuro
                  ? '#B8C7D9'
                  : '#777777',
              },
            ]}
          >
            Um modo escuro
          </Text>

        </View>

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
    fontWeight: '400',
    marginBottom: 30,
  },

  modo: {
    fontSize: 20,
    marginBottom: 15,
  },

  opcao: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 15,
    marginBottom: 20,
  },

  bolinha: {
    fontSize: 22,
    marginRight: 10,
    marginTop: -2,
  },

  nomeOpcao: {
    fontSize: 16,
  },

  descricao: {
    fontSize: 14,
    marginTop: 3,
  },

});