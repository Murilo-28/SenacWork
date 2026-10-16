import { Ionicons } from '@expo/vector-icons';
import { Stack, router, usePathname } from 'expo-router';
import { useState } from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ThemeProvider,
  useTema,
} from '../contexts/ThemeContext';


export default function RootLayout() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}


function Layout() {

  const pathname = usePathname();

  const {
    modoEscuro,
    resetarTema,
  } = useTema();

  const [menuAberto, setMenuAberto] = useState(false);


  // Telas antes de fazer login
  const telaSemLogin =
    pathname === '/' ||
    pathname === '/cadastro';


  // Abre e fecha o menu
  function abrirFecharMenu() {
    setMenuAberto(!menuAberto);
  }


  // HOME
  function irHome() {
    setMenuAberto(false);

    router.push('/home');
  }


  // CONFIGURAÇÕES
  function irConfig() {
    setMenuAberto(false);

    router.push('/config');
  }


  // PERFIL
  function irPerfil() {
    setMenuAberto(false);

    router.push('/perfil');
  }


  // SAIR
  function sair() {

    setMenuAberto(false);

    // Volta o tema para claro
    resetarTema();

    // Volta para Login
    router.replace('/');
  }


  return (

    <View
      style={[
        styles.container,

        {
          backgroundColor:
            modoEscuro && !telaSemLogin
              ? '#061A36'
              : '#FFFFFF',
        },
      ]}
    >


      {/* ================= HEADER ================= */}

      <View
        style={[
          styles.header,

          {
            backgroundColor:
              modoEscuro && !telaSemLogin
                ? '#0B3456'
                : '#FF9818',
          },
        ]}
      >


        {telaSemLogin ? (

          // HEADER LOGIN

          <Text style={styles.logoLogin}>

            A&P{' '}

            <Text style={styles.senac}>
              SENAC
            </Text>

          </Text>

        ) : (

          <>

            {/* BOTÃO MENU */}

            <Pressable
              style={styles.botaoMenu}
              onPress={abrirFecharMenu}
            >

              <Ionicons
                name={
                  menuAberto
                    ? 'close'
                    : 'menu'
                }
                size={40}
                color="#FFFFFF"
              />

            </Pressable>


            {/* LOGO */}

            <Text style={styles.logo}>

              A&P{' '}

              <Text style={styles.senac}>
                SENAC
              </Text>

            </Text>


            {/* PERFIL */}

            <Pressable
              style={styles.perfil}
              onPress={irPerfil}
            >

              <Ionicons
                name="person-outline"
                size={32}
                color="#222222"
              />

            </Pressable>

          </>

        )}

      </View>



      {/* ================= MENU ================= */}

      {!telaSemLogin && menuAberto && (

        <View
          style={[
            styles.menu,

            {
              backgroundColor:
                modoEscuro
                  ? '#0B3456'
                  : '#E58A12',
            },
          ]}
        >


          {/* HOME */}

          <Pressable
            style={[
              styles.opcaoMenu,

              modoEscuro &&
                styles.opcaoMenuEscuro,
            ]}
            onPress={irHome}
          >

            <Ionicons
              name="home-outline"
              size={40}
              color={
                modoEscuro
                  ? '#FFFFFF'
                  : '#222222'
              }
            />

            <Text
              style={[
                styles.textoMenu,

                modoEscuro &&
                  styles.textoMenuEscuro,
              ]}
            >
              Home
            </Text>

          </Pressable>



          {/* CONFIG */}

          <Pressable
            style={[
              styles.opcaoMenu,

              modoEscuro &&
                styles.opcaoMenuEscuro,
            ]}
            onPress={irConfig}
          >

            <Ionicons
              name="settings-outline"
              size={40}
              color={
                modoEscuro
                  ? '#FFFFFF'
                  : '#222222'
              }
            />

            <Text
              style={[
                styles.textoMenu,

                modoEscuro &&
                  styles.textoMenuEscuro,
              ]}
            >
              Config
            </Text>

          </Pressable>



          {/* SAIR */}

          <Pressable
            style={[
              styles.opcaoMenu,

              modoEscuro &&
                styles.opcaoMenuEscuro,
            ]}
            onPress={sair}
          >

            <Ionicons
              name="log-out-outline"
              size={40}
              color={
                modoEscuro
                  ? '#FFFFFF'
                  : '#222222'
              }
            />

            <Text
              style={[
                styles.textoMenu,

                modoEscuro &&
                  styles.textoMenuEscuro,
              ]}
            >
              Sair
            </Text>

          </Pressable>

        </View>

      )}



      {/* ================= PÁGINAS ================= */}

      <View style={styles.conteudo}>

        <Stack
          screenOptions={{
            headerShown: false,

            contentStyle: {
              backgroundColor:
                modoEscuro &&
                !telaSemLogin
                  ? '#061A36'
                  : '#FFFFFF',
            },
          }}
        />

      </View>

    </View>

  );
}



const styles = StyleSheet.create({

  container: {
    flex: 1,
  },


  /* HEADER */

  header: {

    height: 95,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 18,

    paddingTop: 15,

    zIndex: 10,

  },


  /* LOGIN */

  logoLogin: {

    fontSize: 30,

    color: '#FFFFFF',

    textShadowColor: '#000000',

    textShadowOffset: {
      width: 1,
      height: 1,
    },

    textShadowRadius: 1,

  },


  /* MENU */

  botaoMenu: {

    marginRight: 20,

  },


  /* LOGO */

  logo: {

    fontSize: 27,

    color: '#FFFFFF',

    textDecorationLine: 'underline',

    textShadowColor: '#000000',

    textShadowOffset: {
      width: 1,
      height: 1,
    },

    textShadowRadius: 1,

  },


  senac: {

    color: '#005594',

    fontWeight: 'bold',

  },


  /* PERFIL */

  perfil: {

    marginLeft: 'auto',

    width: 58,

    height: 58,

    borderRadius: 29,

    backgroundColor: '#E7E7E7',

    alignItems: 'center',

    justifyContent: 'center',

  },


  /* MENU ABERTO */

  menu: {

    position: 'absolute',

    top: 95,

    left: 0,

    width: '100%',

    paddingHorizontal: 28,

    paddingVertical: 25,

    zIndex: 100,

  },


  opcaoMenu: {

    height: 90,

    backgroundColor: '#E5E5E5',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 20,

    marginBottom: 10,

  },


  opcaoMenuEscuro: {

    backgroundColor: '#061A36',

  },


  textoMenu: {

    fontSize: 35,

    color: '#111111',

    marginLeft: 20,

  },


  textoMenuEscuro: {

    color: '#FFFFFF',

  },


  /* CONTEÚDO */

  conteudo: {

    flex: 1,

  },

});