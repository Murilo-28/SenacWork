import { useState } from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

type Usuario = {
    nome: string;
    email: string;
    senha: string;
};

export default function CadastroScreen() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [mensagem, setMensagem] = useState('');

    async function cadastrar() {
        setMensagem('');

        const emailLimpo = email.trim().toLowerCase();

        if (!nome.trim() || !emailLimpo || !senha || !confirmarSenha) {
            setMensagem('Preencha todos os campos.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
            setMensagem('Digite um e-mail válido.');
            return;
        }

        if (senha.length < 6) {
            setMensagem('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            setMensagem('As senhas não coincidem.');
            return;
        }

        try {
            const dados = await AsyncStorage.getItem('usuarios');
            const usuarios: Usuario[] = dados ? JSON.parse(dados) : [];

            const emailExiste = usuarios.some(
                usuario => usuario.email === emailLimpo
            );

            if (emailExiste) {
                setMensagem('E-mail já cadastrado. Utilize outro e-mail ou faça login.');
                return;
            }

            usuarios.push({
                nome: nome.trim(),
                email: emailLimpo,
                senha: senha,
            });

            await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

            router.replace('/');
        } catch (erro) {
            console.error('Erro ao cadastrar:', erro);
            setMensagem('Não foi possível salvar o cadastro.');
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.conteudo}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.titulo}>
                    Bem-Vindo ao
                    {'\n'}Achados e Perdidos
                    {'\n'}do Senac
                </Text>

                <View style={styles.formulario}>
                    <Text style={styles.subtitulo}>Cadastro</Text>

                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Crie uma senha"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmar senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a senha novamente"
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        secureTextEntry
                    />

                    {mensagem !== '' && (
                        <Text style={styles.erro}>{mensagem}</Text>
                    )}

                    <Pressable style={styles.botao} onPress={cadastrar}>
                        <Text style={styles.textoBotao}>Cadastrar</Text>
                    </Pressable>

                    <Text style={styles.textoLogin}>Já possui uma conta?</Text>

                    <Pressable onPress={() => router.replace('/')}>
                        <Text style={styles.link}>Fazer login</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    conteudo: {
        flexGrow: 1,
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: '9%',
        paddingVertical: 30,
    },

    titulo: {
        fontSize: 21,
        color: '#111111',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 27,
    },

    formulario: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 6,
        padding: 16,
        paddingTop: 20,
    },

    subtitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 22,
        color: '#111111',
    },

    label: {
        fontSize: 12,
        color: '#333333',
        marginBottom: 6,
    },

    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 6,
        paddingHorizontal: 10,
        marginBottom: 16,
        fontSize: 13,
    },

    erro: {
        color: '#D32F2F',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 12,
    },

    botao: {
        height: 40,
        backgroundColor: '#00549A',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 20,
    },

    textoBotao: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },

    textoLogin: {
        color: '#333333',
        fontSize: 12,
        textAlign: 'center',
    },

    link: {
        color: '#0000FF',
        fontSize: 12,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 4,
    },
});