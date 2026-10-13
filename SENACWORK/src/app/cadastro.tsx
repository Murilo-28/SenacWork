import { router } from 'expo-router';
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

export default function CadastroScreen() {
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
                        autoCapitalize="words"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Crie uma senha"
                        secureTextEntry
                    />

                    <Text style={styles.label}>Confirmar senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a senha novamente"
                        secureTextEntry
                    />

                    <Pressable style={styles.botao}>
                        <Text style={styles.textoBotao}>Cadastrar</Text>
                    </Pressable>

                    <Text style={styles.textoLogin}>
                        Já possui uma conta?
                    </Text>

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