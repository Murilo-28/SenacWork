import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';

const opcoes = [
  {
    valor: 'claro',
    nome: 'Claro',
    descricao: 'Fundo claro, ideal para o dia',
    icone: 'sunny-outline',
  },
  {
    valor: 'escuro',
    nome: 'Escuro',
    descricao: 'Fundo escuro, mais confortável à noite',
    icone: 'moon-outline',
  },
] as const;

export default function Config() {
  const { tema, modoEscuro, mudarTema } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Configurações</Text>
        <Text style={styles.subtitulo}>Personalize o app</Text>
      </View>

      <Text style={styles.secao}>APARÊNCIA</Text>

      <View style={styles.cartao}>
        {opcoes.map((opcao, indice) => {
          const ativo = tema === opcao.valor;

          return (
            <Pressable
              key={opcao.valor}
              style={[
                styles.opcao,
                indice > 0 && styles.opcaoComBorda,
              ]}
              onPress={() => mudarTema(opcao.valor)}
            >
              <View style={[styles.icone, ativo && styles.iconeAtivo]}>
                <Ionicons
                  name={opcao.icone}
                  size={20}
                  color={ativo ? '#FFFFFF' : cores.secundario}
                />
              </View>

              <View style={styles.textos}>
                <Text style={styles.nomeOpcao}>{opcao.nome}</Text>
                <Text style={styles.descricao}>{opcao.descricao}</Text>
              </View>

              <Ionicons
                name={ativo ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={ativo ? cores.primario : cores.borda}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.fundo,
      paddingHorizontal: 24,
      paddingTop: 28,
    },

    cabecalho: {
      marginBottom: 28,
    },

    titulo: {
      fontSize: 30,
      fontWeight: '800',
      letterSpacing: -0.5,
      color: c.texto,
    },

    subtitulo: {
      fontSize: 14,
      color: c.secundario,
      marginTop: 6,
    },

    secao: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2,
      color: c.secundario,
      marginBottom: 10,
      marginLeft: 4,
    },

    cartao: {
      backgroundColor: c.superficie,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borda,
      overflow: 'hidden',
    },

    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
    },

    opcaoComBorda: {
      borderTopWidth: 1,
      borderTopColor: c.borda,
    },

    icone: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.primarioSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconeAtivo: {
      backgroundColor: c.primario,
    },

    textos: {
      flex: 1,
    },

    nomeOpcao: {
      fontSize: 15,
      fontWeight: '600',
      color: c.texto,
    },

    descricao: {
      fontSize: 13,
      color: c.secundario,
      marginTop: 2,
    },
  });