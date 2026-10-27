import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LIMITES } from '../constants/limites';
import { Colors, type Paleta } from '../constants/theme';
import { useTema } from '../contexts/ThemeContext';

type Usuario = {
  nome: string;
  email: string;
  senha: string;
};

export default function PerfilScreen() {
  const { modoEscuro } = useTema();

  const cores = modoEscuro ? Colors.dark : Colors.light;
  const styles = useMemo(() => criarEstilos(cores), [cores]);

  const [nome, setNome] = useState('');
  const [nomeSalvo, setNomeSalvo] = useState('');
  const [email, setEmail] = useState('');
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  // Carrega o usuário logado toda vez que a tela abre
  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        try {
          const logado = await AsyncStorage.getItem('usuarioLogado');
          const usuario = logado ? JSON.parse(logado) : null;

          setNome(usuario?.nome ?? '');
          setNomeSalvo(usuario?.nome ?? '');
          setEmail(usuario?.email ?? '');
          setEditando(false);
          setErro('');
          setSucesso('');
        } catch (e) {
          console.log('Erro ao carregar perfil:', e);
        }
      }

      carregar();
    }, [])
  );

  async function salvar() {
    if (salvando) return;

    setErro('');
    setSucesso('');

    const nomeLimpo = nome.trim();

    if (!nomeLimpo) {
      setErro('Digite seu nome.');
      return;
    }

    try {
      setSalvando(true);

      // Atualiza a lista de usuários (usada no login)
      const dados = await AsyncStorage.getItem('usuarios');
      const usuarios: Usuario[] = dados ? JSON.parse(dados) : [];

      const atualizados = usuarios.map((u) =>
        u.email === email ? { ...u, nome: nomeLimpo } : u
      );

      await AsyncStorage.setItem('usuarios', JSON.stringify(atualizados));

      // Atualiza o usuário logado
      await AsyncStorage.setItem(
        'usuarioLogado',
        JSON.stringify({ nome: nomeLimpo, email })
      );

      setNome(nomeLimpo);
      setNomeSalvo(nomeLimpo);
      setEditando(false);
      setSucesso('Perfil atualizado!');
    } catch (e) {
      console.log('Erro ao salvar perfil:', e);
      setErro('Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  }

  function cancelar() {
    setNome(nomeSalvo);
    setEditando(false);
    setErro('');
  }

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
            {nomeSalvo.trim().charAt(0).toUpperCase() || '?'}
          </Text>
        </View>

        <Text style={styles.nome}>{nomeSalvo || 'Sem nome'}</Text>
        <Text style={styles.tipo}>Usuário do SENAC</Text>

        <View style={styles.divisor} />

        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={[styles.input, editando && styles.inputEditando]}
          value={nome}
          onChangeText={setNome}
          editable={editando}
          maxLength={LIMITES.nome}
          placeholder="Digite seu nome"
          placeholderTextColor={cores.secundario}
          autoCapitalize="words"
        />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={[styles.input, styles.inputBloqueado]}
          value={email}
          editable={false}
          maxLength={LIMITES.email}
        />
        <Text style={styles.dica}>O e-mail não pode ser alterado.</Text>

        {erro !== '' && (
          <View style={styles.caixaErro}>
            <Text style={styles.erro}>{erro}</Text>
          </View>
        )}

        {sucesso !== '' && (
          <View style={styles.caixaSucesso}>
            <Text style={styles.sucesso}>{sucesso}</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.botao,
            pressed && styles.botaoPressionado,
            salvando && styles.botaoDesativado,
          ]}
          disabled={salvando}
          onPress={() => {
            if (editando) {
              salvar();
            } else {
              setSucesso('');
              setEditando(true);
            }
          }}
        >
          <Text style={styles.textoBotao}>
            {salvando
              ? 'Salvando...'
              : editando
                ? 'Salvar alterações'
                : 'Editar perfil'}
          </Text>
        </Pressable>

        {editando && (
          <Pressable style={styles.botaoCancelar} onPress={cancelar}>
            <Text style={styles.textoCancelar}>Cancelar</Text>
          </Pressable>
        )}
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

    inputBloqueado: {
      marginBottom: 6,
      color: c.secundario,
    },

    dica: {
      fontSize: 12,
      color: c.secundario,
      marginBottom: 18,
    },

    caixaErro: {
      backgroundColor: '#FDECEC',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 14,
    },

    erro: {
      color: '#D32F2F',
      fontSize: 13,
      lineHeight: 18,
    },

    caixaSucesso: {
      backgroundColor: '#E8F6EE',
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 14,
    },

    sucesso: {
      color: '#1B8A4B',
      fontSize: 13,
      lineHeight: 18,
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

    botaoDesativado: {
      opacity: 0.6,
    },

    textoBotao: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },

    botaoCancelar: {
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },

    textoCancelar: {
      fontSize: 14,
      fontWeight: '600',
      color: c.secundario,
    },
  });