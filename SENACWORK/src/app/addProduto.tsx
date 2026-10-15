From dd3f5f418e7644049fe004b9fb00702cd5e391e9 Mon Sep 17 00:00:00 2001
From: Claude <noreply@anthropic.com>
Date: Thu, 15 Oct 2026 21:57:56 +0000
Subject: [PATCH] Adiciona tela para cadastrar produto perdido

- Nova tela src/app/add-produto.tsx, no mesmo visual da Home, com os campos
  nome, categoria, descricao, local, data e contato.
- Validacao dos campos e mascara de data em src/utils/formulario-produto.ts.
- Ao salvar, o produto vai para a Home: o ProdutosProvider
  (src/context/produtos-context.tsx) guarda a lista e a Home mostra em
  "Produtos perdidos" (src/components/lista-produtos.tsx).
- Home: botao "Adicionar produto perdido" e lista abaixo do login; a tela
  passou a ser um ScrollView para rolar quando a lista crescer.
- _layout.tsx: envolve o Stack com o ProdutosProvider e define o titulo da tela.

Os produtos ficam so em memoria por enquanto (ainda sem banco ou storage).
---
 SENACWORK/src/app/_layout.tsx               |  12 +-
 SENACWORK/src/app/add-produto.tsx           | 292 ++++++++++++++++++++
 SENACWORK/src/app/index.tsx                 |  38 ++-
 SENACWORK/src/components/lista-produtos.tsx |  76 +++++
 SENACWORK/src/constants/produtos.ts         |  27 ++
 SENACWORK/src/context/produtos-context.tsx  |  44 +++
 SENACWORK/src/utils/formulario-produto.ts   |  85 ++++++
 7 files changed, 568 insertions(+), 6 deletions(-)
 create mode 100644 SENACWORK/src/app/add-produto.tsx
 create mode 100644 SENACWORK/src/components/lista-produtos.tsx
 create mode 100644 SENACWORK/src/constants/produtos.ts
 create mode 100644 SENACWORK/src/context/produtos-context.tsx
 create mode 100644 SENACWORK/src/utils/formulario-produto.ts

diff --git a/SENACWORK/src/app/_layout.tsx b/SENACWORK/src/app/_layout.tsx
index dba869c..b5097c6 100644
--- a/SENACWORK/src/app/_layout.tsx
+++ b/SENACWORK/src/app/_layout.tsx
@@ -1,5 +1,13 @@
 import { Stack } from 'expo-router';
 
+import { ProdutosProvider } from '@/context/produtos-context';
+
 export default function RootLayout() {
-  return <Stack />;
-}
\ No newline at end of file
+  return (
+    <ProdutosProvider>
+      <Stack>
+        <Stack.Screen name="add-produto" options={{ title: 'Adicionar produto perdido' }} />
+      </Stack>
+    </ProdutosProvider>
+  );
+}
diff --git a/SENACWORK/src/app/add-produto.tsx b/SENACWORK/src/app/add-produto.tsx
new file mode 100644
index 0000000..d3d9d0f
--- /dev/null
+++ b/SENACWORK/src/app/add-produto.tsx
@@ -0,0 +1,292 @@
+import { useRouter } from 'expo-router';
+import { useState, type ReactNode } from 'react';
+import {
+  KeyboardAvoidingView,
+  Platform,
+  Pressable,
+  ScrollView,
+  StyleSheet,
+  Text,
+  TextInput,
+  View,
+} from 'react-native';
+
+import { CATEGORIAS, type Categoria } from '@/constants/produtos';
+import { useProdutos } from '@/context/produtos-context';
+import {
+  dataDeHoje,
+  mascaraData,
+  validarFormulario,
+  type ErrosFormulario,
+} from '@/utils/formulario-produto';
+
+type CampoProps = {
+  label: string;
+  erro?: string;
+  children: ReactNode;
+};
+
+/** Título do campo, o campo em si e a mensagem de erro logo abaixo. */
+function Campo({ label, erro, children }: CampoProps) {
+  return (
+    <View style={styles.campo}>
+      <Text style={styles.label}>{label}</Text>
+      {children}
+      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
+    </View>
+  );
+}
+
+export default function AddProdutoScreen() {
+  const router = useRouter();
+  const { adicionarProduto } = useProdutos();
+
+  const [nome, setNome] = useState('');
+  const [categoria, setCategoria] = useState<Categoria | null>(null);
+  const [descricao, setDescricao] = useState('');
+  const [local, setLocal] = useState('');
+  const [data, setData] = useState(dataDeHoje);
+  const [contato, setContato] = useState('');
+  const [erros, setErros] = useState<ErrosFormulario>({});
+
+  // Quando a pessoa mexe em um campo, a mensagem de erro dele some.
+  function limparErro(campo: keyof ErrosFormulario) {
+    setErros((atuais) => ({ ...atuais, [campo]: undefined }));
+  }
+
+  function adicionar() {
+    const novosErros = validarFormulario({ nome, categoria, descricao, local, data, contato });
+    setErros(novosErros);
+
+    if (categoria === null || Object.keys(novosErros).length > 0) return;
+
+    adicionarProduto({
+      nome: nome.trim(),
+      categoria,
+      descricao: descricao.trim(),
+      local: local.trim(),
+      data,
+      contato: contato.trim(),
+    });
+
+    // Volta para a Home, onde o produto aparece na lista.
+    router.dismissTo('/');
+  }
+
+  return (
+    <KeyboardAvoidingView
+      style={styles.teclado}
+      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
+      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
+        <Text style={styles.titulo}>Adicione o produto que você perdeu</Text>
+
+        <Text style={styles.subtitulo}>Dados do produto</Text>
+
+        <Campo label="Nome do produto" erro={erros.nome}>
+          <TextInput
+            style={[styles.input, erros.nome ? styles.inputErro : null]}
+            placeholder="Ex.: Carteira preta"
+            value={nome}
+            onChangeText={(texto) => {
+              setNome(texto);
+              limparErro('nome');
+            }}
+            maxLength={60}
+          />
+        </Campo>
+
+        <Campo label="Categoria" erro={erros.categoria}>
+          <View style={styles.categorias} accessibilityRole="radiogroup">
+            {CATEGORIAS.map((item) => {
+              const selecionada = item === categoria;
+
+              return (
+                <Pressable
+                  key={item}
+                  accessibilityRole="radio"
+                  accessibilityState={{ checked: selecionada }}
+                  style={[styles.categoria, selecionada ? styles.categoriaSelecionada : null]}
+                  onPress={() => {
+                    setCategoria(item);
+                    limparErro('categoria');
+                  }}>
+                  <Text
+                    style={[
+                      styles.textoCategoria,
+                      selecionada ? styles.textoCategoriaSelecionada : null,
+                    ]}>
+                    {item}
+                  </Text>
+                </Pressable>
+              );
+            })}
+          </View>
+        </Campo>
+
+        <Campo label="Descrição (opcional)">
+          <TextInput
+            style={[styles.input, styles.inputGrande]}
+            placeholder="Cor, marca e detalhes que ajudam a reconhecer"
+            value={descricao}
+            onChangeText={setDescricao}
+            multiline
+            numberOfLines={4}
+            textAlignVertical="top"
+            maxLength={300}
+          />
+        </Campo>
+
+        <Campo label="Onde você perdeu" erro={erros.local}>
+          <TextInput
+            style={[styles.input, erros.local ? styles.inputErro : null]}
+            placeholder="Ex.: Biblioteca, sala 12"
+            value={local}
+            onChangeText={(texto) => {
+              setLocal(texto);
+              limparErro('local');
+            }}
+            maxLength={80}
+          />
+        </Campo>
+
+        <Campo label="Data em que perdeu" erro={erros.data}>
+          <TextInput
+            style={[styles.input, erros.data ? styles.inputErro : null]}
+            placeholder="dd/mm/aaaa"
+            keyboardType="number-pad"
+            value={data}
+            onChangeText={(texto) => {
+              setData(mascaraData(texto));
+              limparErro('data');
+            }}
+            maxLength={10}
+          />
+        </Campo>
+
+        <Campo label="Contato (WhatsApp ou e-mail)" erro={erros.contato}>
+          <TextInput
+            style={[styles.input, erros.contato ? styles.inputErro : null]}
+            placeholder="Ex.: (54) 99999-0000"
+            autoCapitalize="none"
+            autoCorrect={false}
+            value={contato}
+            onChangeText={(texto) => {
+              setContato(texto);
+              limparErro('contato');
+            }}
+            maxLength={60}
+          />
+        </Campo>
+
+        <Pressable
+          accessibilityRole="button"
+          style={({ pressed }) => [styles.botao, pressed ? styles.pressionado : null]}
+          onPress={adicionar}>
+          <Text style={styles.textoBotao}>Adicionar produto</Text>
+        </Pressable>
+      </ScrollView>
+    </KeyboardAvoidingView>
+  );
+}
+
+// Os estilos seguem os da Home (src/app/index.tsx): mesmas cores, bordas e espaçamentos.
+const styles = StyleSheet.create({
+  teclado: {
+    flex: 1,
+  },
+
+  container: {
+    flexGrow: 1,
+    padding: 20,
+  },
+
+  titulo: {
+    fontSize: 24,
+    fontWeight: 'bold',
+    textAlign: 'center',
+    marginBottom: 30,
+  },
+
+  subtitulo: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    marginBottom: 15,
+  },
+
+  campo: {
+    marginBottom: 12,
+  },
+
+  label: {
+    fontSize: 14,
+    fontWeight: '600',
+    marginBottom: 6,
+  },
+
+  input: {
+    borderWidth: 1,
+    borderColor: '#999',
+    borderRadius: 8,
+    padding: 12,
+  },
+
+  inputGrande: {
+    minHeight: 100,
+  },
+
+  inputErro: {
+    borderColor: '#DC2626',
+  },
+
+  erro: {
+    color: '#DC2626',
+    fontSize: 13,
+    marginTop: 4,
+  },
+
+  categorias: {
+    flexDirection: 'row',
+    flexWrap: 'wrap',
+    gap: 8,
+  },
+
+  categoria: {
+    borderWidth: 1,
+    borderColor: '#999',
+    borderRadius: 8,
+    paddingVertical: 8,
+    paddingHorizontal: 12,
+  },
+
+  categoriaSelecionada: {
+    backgroundColor: '#6D28D9',
+    borderColor: '#6D28D9',
+  },
+
+  textoCategoria: {
+    fontSize: 14,
+  },
+
+  textoCategoriaSelecionada: {
+    color: 'white',
+    fontWeight: 'bold',
+  },
+
+  botao: {
+    backgroundColor: '#6D28D9',
+    padding: 15,
+    borderRadius: 8,
+    alignItems: 'center',
+    marginTop: 10,
+  },
+
+  pressionado: {
+    opacity: 0.8,
+  },
+
+  textoBotao: {
+    color: 'white',
+    fontSize: 16,
+    fontWeight: 'bold',
+  },
+});
diff --git a/SENACWORK/src/app/index.tsx b/SENACWORK/src/app/index.tsx
index efb6f24..1b6b639 100644
--- a/SENACWORK/src/app/index.tsx
+++ b/SENACWORK/src/app/index.tsx
@@ -1,8 +1,13 @@
-import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
+import { useRouter } from 'expo-router';
+import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
+
+import { ListaProdutos } from '@/components/lista-produtos';
 
 export default function HomeScreen() {
+  const router = useRouter();
+
   return (
-    <View style={styles.container}>
+    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
 
       <Text style={styles.titulo}>
         Bem-vindo ao Achados e Perdidos do SENAC
@@ -35,14 +40,24 @@ export default function HomeScreen() {
         </Text>
       </Pressable>
 
-    </View>
+      <Pressable
+        style={styles.botaoSecundario}
+        onPress={() => router.push('/add-produto')}>
+        <Text style={styles.textoBotaoSecundario}>
+          Adicionar produto perdido
+        </Text>
+      </Pressable>
+
+      <ListaProdutos />
+
+    </ScrollView>
   );
 }
 
 const styles = StyleSheet.create({
   container: {
     width: 'auto',
-    flex: 1,
+    flexGrow: 1,
     padding: 20,
     justifyContent: 'center',
   },
@@ -81,4 +96,19 @@ const styles = StyleSheet.create({
     fontSize: 16,
     fontWeight: 'bold',
   },
+
+  botaoSecundario: {
+    borderWidth: 1,
+    borderColor: '#6D28D9',
+    padding: 15,
+    borderRadius: 8,
+    alignItems: 'center',
+    marginTop: 10,
+  },
+
+  textoBotaoSecundario: {
+    color: '#6D28D9',
+    fontSize: 16,
+    fontWeight: 'bold',
+  },
 });
\ No newline at end of file
diff --git a/SENACWORK/src/components/lista-produtos.tsx b/SENACWORK/src/components/lista-produtos.tsx
new file mode 100644
index 0000000..aae7ea9
--- /dev/null
+++ b/SENACWORK/src/components/lista-produtos.tsx
@@ -0,0 +1,76 @@
+import { StyleSheet, Text, View } from 'react-native';
+
+import { useProdutos } from '@/context/produtos-context';
+
+export function ListaProdutos() {
+  const { produtos } = useProdutos();
+
+  return (
+    <View style={styles.container}>
+      <Text style={styles.subtitulo}>Produtos perdidos</Text>
+
+      {produtos.length === 0 ? (
+        <Text style={styles.vazio}>
+          Nenhum produto cadastrado ainda. Use o botão acima para adicionar o primeiro.
+        </Text>
+      ) : (
+        produtos.map((produto) => (
+          <View key={produto.id} style={styles.card}>
+            <Text style={styles.nome}>{produto.nome}</Text>
+            <Text style={styles.categoria}>{produto.categoria}</Text>
+
+            {produto.descricao ? <Text style={styles.descricao}>{produto.descricao}</Text> : null}
+
+            <Text style={styles.detalhe}>Perdido em: {produto.local}</Text>
+            <Text style={styles.detalhe}>Data: {produto.data}</Text>
+            <Text style={styles.detalhe}>Contato: {produto.contato}</Text>
+          </View>
+        ))
+      )}
+    </View>
+  );
+}
+
+const styles = StyleSheet.create({
+  container: {
+    marginTop: 30,
+  },
+
+  subtitulo: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    marginBottom: 15,
+  },
+
+  vazio: {
+    color: '#666',
+  },
+
+  card: {
+    borderWidth: 1,
+    borderColor: '#999',
+    borderRadius: 8,
+    padding: 12,
+    marginBottom: 12,
+  },
+
+  nome: {
+    fontSize: 16,
+    fontWeight: 'bold',
+  },
+
+  categoria: {
+    color: '#6D28D9',
+    fontWeight: 'bold',
+    marginTop: 2,
+  },
+
+  descricao: {
+    marginTop: 6,
+  },
+
+  detalhe: {
+    color: '#666',
+    marginTop: 4,
+  },
+});
diff --git a/SENACWORK/src/constants/produtos.ts b/SENACWORK/src/constants/produtos.ts
new file mode 100644
index 0000000..17bcc17
--- /dev/null
+++ b/SENACWORK/src/constants/produtos.ts
@@ -0,0 +1,27 @@
+/** Categorias que a pessoa pode escolher ao cadastrar um produto perdido. */
+export const CATEGORIAS = [
+  'Documentos',
+  'Eletrônicos',
+  'Material escolar',
+  'Roupas e acessórios',
+  'Chaves',
+  'Outros',
+] as const;
+
+export type Categoria = (typeof CATEGORIAS)[number];
+
+export type Produto = {
+  id: string;
+  nome: string;
+  categoria: Categoria;
+  descricao: string;
+  local: string;
+  /** Data em que o produto foi perdido, no formato dd/mm/aaaa. */
+  data: string;
+  /** WhatsApp ou e-mail de quem perdeu. */
+  contato: string;
+  criadoEm: number;
+};
+
+/** Dados que vêm do formulário. O id e a data de criação são gerados ao salvar. */
+export type NovoProduto = Omit<Produto, 'id' | 'criadoEm'>;
diff --git a/SENACWORK/src/context/produtos-context.tsx b/SENACWORK/src/context/produtos-context.tsx
new file mode 100644
index 0000000..97c9f53
--- /dev/null
+++ b/SENACWORK/src/context/produtos-context.tsx
@@ -0,0 +1,44 @@
+import { createContext, useContext, useState, type ReactNode } from 'react';
+
+import type { NovoProduto, Produto } from '@/constants/produtos';
+
+type ProdutosContextValue = {
+  /** Produtos perdidos, do mais novo para o mais antigo. */
+  produtos: Produto[];
+  adicionarProduto: (dados: NovoProduto) => void;
+};
+
+const ProdutosContext = createContext<ProdutosContextValue | null>(null);
+
+function criarId(): string {
+  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
+}
+
+/**
+ * Guarda a lista de produtos em memória e deixa qualquer tela ler ou adicionar.
+ * Por enquanto não salva em banco: ao fechar o app a lista volta a ficar vazia.
+ */
+export function ProdutosProvider({ children }: { children: ReactNode }) {
+  const [produtos, setProdutos] = useState<Produto[]>([]);
+
+  function adicionarProduto(dados: NovoProduto) {
+    const novo: Produto = { ...dados, id: criarId(), criadoEm: Date.now() };
+    setProdutos((atuais) => [novo, ...atuais]);
+  }
+
+  return (
+    <ProdutosContext.Provider value={{ produtos, adicionarProduto }}>
+      {children}
+    </ProdutosContext.Provider>
+  );
+}
+
+export function useProdutos(): ProdutosContextValue {
+  const contexto = useContext(ProdutosContext);
+
+  if (!contexto) {
+    throw new Error('useProdutos precisa ser usado dentro do ProdutosProvider (src/app/_layout.tsx).');
+  }
+
+  return contexto;
+}
diff --git a/SENACWORK/src/utils/formulario-produto.ts b/SENACWORK/src/utils/formulario-produto.ts
new file mode 100644
index 0000000..fea7cf3
--- /dev/null
+++ b/SENACWORK/src/utils/formulario-produto.ts
@@ -0,0 +1,85 @@
+import type { Categoria } from '@/constants/produtos';
+
+export type CamposFormulario = {
+  nome: string;
+  categoria: Categoria | null;
+  descricao: string;
+  local: string;
+  data: string;
+  contato: string;
+};
+
+/** Mensagem de erro de cada campo que não passou na validação. */
+export type ErrosFormulario = Partial<Record<keyof CamposFormulario, string>>;
+
+const ANO_MINIMO = 2000;
+
+/** Transforma o que a pessoa digita em dd/mm/aaaa (só aceita números). */
+export function mascaraData(texto: string): string {
+  const numeros = texto.replace(/\D/g, '').slice(0, 8);
+
+  if (numeros.length <= 2) return numeros;
+  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
+  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
+}
+
+function doisDigitos(numero: number): string {
+  return String(numero).padStart(2, '0');
+}
+
+/** Data de hoje no formato dd/mm/aaaa. */
+export function dataDeHoje(hoje: Date = new Date()): string {
+  return `${doisDigitos(hoje.getDate())}/${doisDigitos(hoje.getMonth() + 1)}/${hoje.getFullYear()}`;
+}
+
+/** Devolve a mensagem de erro da data, ou null se estiver tudo certo. */
+export function erroDaData(texto: string, hoje: Date = new Date()): string | null {
+  if (texto.trim() === '') return 'Informe a data em que perdeu.';
+
+  const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
+  if (!partes) return 'Data inválida. Use o formato dd/mm/aaaa.';
+
+  const dia = Number(partes[1]);
+  const mes = Number(partes[2]);
+  const ano = Number(partes[3]);
+  const data = new Date(ano, mes - 1, dia);
+
+  // Evita datas que não existem, como 31/02.
+  const existe =
+    data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
+  if (!existe || ano < ANO_MINIMO) return 'Data inválida. Use o formato dd/mm/aaaa.';
+
+  const inicioDeHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
+  if (data.getTime() > inicioDeHoje.getTime()) return 'A data não pode ser no futuro.';
+
+  return null;
+}
+
+/** Aceita um e-mail (nome@dominio.com) ou um telefone/WhatsApp com 8 a 13 números. */
+export function contatoValido(texto: string): boolean {
+  const valor = texto.trim();
+
+  if (valor.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
+
+  const numeros = valor.replace(/\D/g, '');
+  return numeros.length >= 8 && numeros.length <= 13 && /^[\d\s()+-]+$/.test(valor);
+}
+
+/** Confere o formulário inteiro. Se devolver um objeto vazio, pode salvar. */
+export function validarFormulario(
+  campos: CamposFormulario,
+  hoje: Date = new Date(),
+): ErrosFormulario {
+  const erros: ErrosFormulario = {};
+
+  if (campos.nome.trim().length < 2) erros.nome = 'Informe o nome do produto.';
+  if (campos.categoria === null) erros.categoria = 'Escolha uma categoria.';
+  if (campos.local.trim().length < 2) erros.local = 'Informe onde você perdeu o produto.';
+
+  const erroData = erroDaData(campos.data, hoje);
+  if (erroData) erros.data = erroData;
+
+  if (!contatoValido(campos.contato)) erros.contato = 'Informe um e-mail ou WhatsApp válido.';
+
+  return erros;
+}
-- 
2.43.0

