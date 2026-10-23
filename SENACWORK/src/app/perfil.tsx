import { useMemo, useState } from 'react';

import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';

export default function PerfilScreen() {
  const { modoEscuro } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [nome, setNome] = useState('Seu nome');
  const [email, setEmail] = useState('seuemail@email.com');
  const [editando, setEditando] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Meu perfil</Text>
        <Text style={styles.subtitulo}>Seus dados no app</Text>
      </View>

      <View style={styles.cartao}>
        <View style={styles.avatar}>
          <Text style={styles.letra}>
            {nome.trim().charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <Text style={styles.nome}>{nome}</Text>
        <Text style={styles.tipo}>Usuário do SENAC</Text>

        <View style={styles.divisor} />

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={[styles.input, editando && styles.inputEditando]}
          value={nome}
          onChangeText={setNome}
          editable={editando}
          placeholder="Digite seu nome"
          placeholderTextColor={cores.secundario}
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, editando && styles.inputEditando]}
          value={email}
          onChangeText={setEmail}
          editable={editando}
          placeholder="Digite seu e-mail"
          placeholderTextColor={cores.secundario}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
          ]}
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
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.fundo,
    },

    conteudo: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 28,
      paddingBottom: 32,
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

    cartao: {
      backgroundColor: c.superficie,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borda,
      padding: 22,
    },

    avatar: {
      width: 84,
      height: 84,
      borderRadius: 42,
      backgroundColor: c.primarioSuave,
      borderWidth: 3,
      borderColor: c.acento,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },

    letra: {
      color: c.primario,
      fontSize: 34,
      fontWeight: '800',
    },

    nome: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      color: c.texto,
    },

    tipo: {
      fontSize: 13,
      textAlign: 'center',
      color: c.secundario,
      marginTop: 4,
    },

    divisor: {
      height: 1,
      backgroundColor: c.borda,
      marginVertical: 22,
    },

    label: {
      fontSize: 12,
      fontWeight: '600',
      color: c.secundario,
      marginBottom: 8,
    },

    input: {
      height: 50,
      borderWidth: 1.5,
      borderColor: c.borda,
      borderRadius: 12,
      paddingHorizontal: 14,
      marginBottom: 18,
      fontSize: 15,
      color: c.texto,
      backgroundColor: c.fundo,
    },

    inputEditando: {
      borderColor: c.primario,
      backgroundColor: c.superficie,
    },

    botao: {
      height: 52,
      backgroundColor: c.primario,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
      shadowColor: c.primario,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 4,
    },

    botaoPressionado: {
      opacity: 0.88,
      transform: [{ scale: 0.985 }],
    },

    textoBotao: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });