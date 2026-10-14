import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';

import { router } from 'expo-router';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.filtros}>
                <Pressable style={styles.categorias}>
                    <Text style={styles.textoCategorias}>Categorias</Text>
                    <Text style={styles.seta}>⌄</Text>
                </Pressable>

                <TextInput
                    style={styles.pesquisa}
                    placeholder="Pesquisar"
                    placeholderTextColor="#AAAAAA"
                />
            </View>

            <View style={styles.vazio}>
                <Text style={styles.textoVazio}>
                    Não tem nada{'\n'}Perdido
                </Text>
            </View>

            <Pressable
                style={styles.botaoAdd}
                onPress={() => router.push('/addProduto')}
            >
                <Text style={styles.textoAdd}>＋</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    filtros: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FF941B',
        paddingHorizontal: 12,
        paddingTop: 40,
        paddingBottom: 10,
    },

    categorias: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 34,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 12,
    },

    textoCategorias: {
        fontSize: 14,
        color: '#111111',
    },

    seta: {
        fontSize: 16,
        color: '#111111',
    },

    pesquisa: {
        flex: 1,
        height: 34,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 14,
    },

    vazio: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },

    textoVazio: {
        fontSize: 40,
        color: '#111111',
        textAlign: 'center',
        lineHeight: 48,
    },

    botaoAdd: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 68,
        height: 68,
        backgroundColor: '#0074E0',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textoAdd: {
        fontSize: 42,
        color: '#111111',
        lineHeight: 48,
    },
});