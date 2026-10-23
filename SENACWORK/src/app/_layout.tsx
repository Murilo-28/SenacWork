import { Ionicons } from '@expo/vector-icons';
import { Stack, router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, type Paleta } from '../constants/theme';
import { ThemeProvider, useTema } from '../contexts/ThemeContext';

const ALTURA_BARRA = 56;

type Rota = '/home' | '/solicitacao' | '/config' | '/perfil';

const itens = [
  { nome: 'Home', icone: 'home-outline', rota: '/home' },
  { nome: 'Solicitar', icone: 'document-text-outline', rota: '/solicitacao' },
  { nome: 'Config', icone: 'settings-outline', rota: '/config' },
] as const;

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

function Layout() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { modoEscuro, resetarTema } = useTema();

  const [menuAberto, setMenuAberto] = useState(false);

  // Telas antes de fazer login: sem barra, quem desenha o topo é o <Header />
  const telaSemLogin = pathname === '/' || pathname === '/cadastro';

  const modoEscuroAtivo = modoEscuro && !telaSemLogin;
  const cores = modoEscuroAtivo ? Colors.dark : Colors.light;
  const styles = criarEstilos(cores);

  const alturaHeader = insets.top + ALTURA_BARRA;

  function ir(rota: Rota) {
    setMenuAberto(false);
    router.push(rota);
  }

  function sair() {
    setMenuAberto(false);
    resetarTema();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <StatusBar
        style={telaSemLogin || modoEscuroAtivo ? 'light' : 'dark'}
      />

      {/* HEADER (só logado) */}
      {!telaSemLogin && (
        <View
          style={[
            styles.header,
            { height: alturaHeader, paddingTop: insets.top },
          ]}
        >
          <Pressable
            style={styles.botaoIcone}
            onPress={() => setMenuAberto(!menuAberto)}
            hitSlop={8}
          >
            <Ionicons
              name={menuAberto ? 'close' : 'menu'}
              size={26}
              color={cores.texto}
            />
          </Pressable>

          <Text style={styles.logo}>
            A&P <Text style={styles.senac}>SENAC</Text>
          </Text>

          <Pressable
            style={[styles.botaoIcone, styles.perfil]}
            onPress={() => ir('/perfil')}
            hitSlop={8}
          >
            <Ionicons name="person-outline" size={20} color={cores.primario} />
          </Pressable>
        </View>
      )}

      {/* MENU */}
      {!telaSemLogin && menuAberto && (
        <>
          <Pressable
            style={[styles.fundoMenu, { top: alturaHeader }]}
            onPress={() => setMenuAberto(false)}
          />

          <View style={[styles.menu, { top: alturaHeader + 8 }]}>
            {itens.map((item) => {
              const ativo = pathname === item.rota;

              return (
                <Pressable
                  key={item.rota}
                  style={[styles.opcaoMenu, ativo && styles.opcaoAtiva]}
                  onPress={() => ir(item.rota)}
                >
                  <Ionicons
                    name={item.icone}
                    size={20}
                    color={ativo ? cores.primario : cores.secundario}
                  />
                  <Text
                    style={[styles.textoMenu, ativo && styles.textoAtivo]}
                  >
                    {item.nome}
                  </Text>
                </Pressable>
              );
            })}

            <View style={styles.divisor} />

            <Pressable style={styles.opcaoMenu} onPress={sair}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={cores.secundario}
              />
              <Text style={styles.textoMenu}>Sair</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* PÁGINAS */}
      <View style={styles.conteudo}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: cores.fundo },
          }}
        />
      </View>
    </View>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.fundo,
    },

    /* HEADER */
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: c.superficie,
      borderBottomWidth: 1,
      borderBottomColor: c.borda,
      zIndex: 10,
    },

    botaoIcone: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },

    logo: {
      flex: 1,
      marginLeft: 8,
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: -0.3,
      color: c.texto,
    },

    senac: {
      color: c.primario,
    },

    perfil: {
      borderRadius: 20,
      backgroundColor: c.primarioSuave,
    },

    /* MENU */
    fundoMenu: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 27, 45, 0.25)',
      zIndex: 50,
    },

    menu: {
      position: 'absolute',
      left: 12,
      width: 220,
      backgroundColor: c.superficie,
      borderRadius: 16,
      padding: 8,
      borderWidth: 1,
      borderColor: c.borda,
      shadowColor: '#0F1B2D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
      zIndex: 100,
    },

    opcaoMenu: {
      height: 46,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 12,
      borderRadius: 10,
    },

    opcaoAtiva: {
      backgroundColor: c.primarioSuave,
    },

    textoMenu: {
      fontSize: 15,
      fontWeight: '500',
      color: c.texto,
    },

    textoAtivo: {
      color: c.primario,
      fontWeight: '600',
    },

    divisor: {
      height: 1,
      backgroundColor: c.borda,
      marginVertical: 6,
      marginHorizontal: 8,
    },

    /* CONTEÚDO */
    conteudo: {
      flex: 1,
    },
  });