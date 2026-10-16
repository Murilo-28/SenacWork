import { Ionicons } from '@expo/vector-icons';
import { Stack, router, usePathname } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function Layout() {
  const pathname = usePathname();

  // Telas que ainda não possuem usuário logado
  const telaSemLogin =
    pathname === '/' ||
    pathname === '/cadastro';

  function abrirMenu() {
    console.log('Abrir menu');
  }

  function abrirPerfil() {
    router.push('/perfil');
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        {telaSemLogin ? (
          // LOGIN / CADASTRO
          <Text style={styles.logoLogin}>
            A&P <Text style={styles.senac}>SENAC</Text>
          </Text>
        ) : (
          // USUÁRIO LOGADO
          <>
            <Pressable
              style={styles.botaoMenu}
              onPress={abrirMenu}
            >
              <Ionicons
                name="menu"
                size={38}
                color="#FFFFFF"
              />
            </Pressable>

            <Text style={styles.logo}>
              A&P <Text style={styles.senac}>SENAC</Text>
            </Text>

            <Pressable
              style={styles.perfil}
              onPress={abrirPerfil}
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

      {/* PÁGINAS */}
      <View style={styles.conteudo}>
        <Stack
          screenOptions={{
            headerShown: false,
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

  header: {
    height: 95,
    backgroundColor: '#FF9818',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,
    paddingTop: 15,
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

  /* LOGADO */

  botaoMenu: {
    marginRight: 20,
  },

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

  perfil: {
    marginLeft: 'auto',

    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#E7E7E7',

    alignItems: 'center',
    justifyContent: 'center',
  },

  conteudo: {
    flex: 1,
  },
});