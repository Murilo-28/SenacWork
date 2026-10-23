import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  local: string;
  data: string;
  descricao?: string;
  foto?: string | null;
  status: string;
};

export default function Home() {
  const { modoEscuro } = useTema();
  const insets = useSafeAreaInsets();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(
    () => criarEstilos(cores, insets.bottom),
    [cores, insets.bottom]
  );

  const [produtos, setProdutos] = useState<Produto[]>([]);

  // Recarrega a lista toda vez que a tela volta a ficar em foco
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const dados = await AsyncStorage.getItem('produtosPerdidos');
          setProdutos(dados ? JSON.parse(dados) : []);
        } catch (erro) {
          console.log('Erro ao carregar produtos:', erro);
        }
      }

      carregar();
    }, [])
  );

  function adicionarProduto() {
    router.push('/addProduto');
  }

  function renderItem({ item }: { item: Produto }) {
    return (
      <View style={styles.item}>
        {item.foto ? (
          <Image source={{ uri: item.foto }} style={styles.itemFoto} />
        ) : (
          <View style={[styles.itemFoto, styles.itemSemFoto]}>
            <Ionicons
              name="cube-outline"
              size={26}
              color={cores.primario}
            />
          </View>
        )}

        <View style={styles.itemTextos}>
          <View style={styles.itemTopo}>
            <Text style={styles.itemNome} numberOfLines={1}>
              {item.nome}
            </Text>
            <View style={styles.status}>
              <Text style={styles.statusTexto}>
                {item.status === 'perdido' ? 'Perdido' : 'Achado'}
              </Text>
            </View>
          </View>

          <Text style={styles.itemInfo} numberOfLines={1}>
            {item.categoria}
          </Text>
          <Text style={styles.itemInfo} numberOfLines={1}>
            {item.local} · {item.data}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.cabecalho}>
            <Text style={styles.titulo}>Início</Text>
            <Text style={styles.subtitulo}>Achados e Perdidos SENAC</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.vazio}>
            <View style={styles.iconeVazio}>
              <Ionicons
                name="search-outline"
                size={26}
                color={cores.primario}
              />
            </View>
            <Text style={styles.tituloVazio}>Nenhum item por aqui</Text>
            <Text style={styles.textoVazio}>
              Toque no botão + para registrar um item perdido.
            </Text>
          </View>
        }
      />

      <Pressable
        style={({ pressed }) => [
          styles.botaoAdicionar,
          pressed && styles.botaoPressionado,
        ]}
        onPress={adicionarProduto}
        hitSlop={8}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const criarEstilos = (c: Paleta, bottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.fundo,
    },

    lista: {
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 120 + bottom,
    },

    cabecalho: {
      marginBottom: 24,
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

    /* ITEM */
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: c.superficie,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 12,
      marginBottom: 12,
    },

    itemFoto: {
      width: 64,
      height: 64,
      borderRadius: 12,
    },

    itemSemFoto: {
      backgroundColor: c.primarioSuave,
      alignItems: 'center',
      justifyContent: 'center',
    },

    itemTextos: {
      flex: 1,
    },

    itemTopo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 4,
    },

    itemNome: {
      flex: 1,
      fontSize: 15,
      fontWeight: '700',
      color: c.texto,
    },

    itemInfo: {
      fontSize: 13,
      color: c.secundario,
      marginTop: 1,
    },

    status: {
      backgroundColor: c.primarioSuave,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 3,
    },

    statusTexto: {
      fontSize: 11,
      fontWeight: '700',
      color: c.primario,
    },

    /* VAZIO */
    vazio: {
      backgroundColor: c.superficie,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borda,
      paddingVertical: 36,
      paddingHorizontal: 24,
      alignItems: 'center',
    },

    iconeVazio: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.primarioSuave,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },

    tituloVazio: {
      fontSize: 16,
      fontWeight: '700',
      color: c.texto,
    },

    textoVazio: {
      fontSize: 13,
      lineHeight: 19,
      color: c.secundario,
      textAlign: 'center',
      marginTop: 6,
    },

    /* BOTÃO + */
    botaoAdicionar: {
      position: 'absolute',
      right: 24,
      bottom: 24 + bottom,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: c.primario,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.primario,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 14,
      elevation: 8,
    },

    botaoPressionado: {
      opacity: 0.88,
      transform: [{ scale: 0.96 }],
    },
  });