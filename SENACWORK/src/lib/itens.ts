import AsyncStorage from '@react-native-async-storage/async-storage';

export type Item = {
  chave: string;
  tipo: 'solicitacao' | 'produto';
  titulo: string;
  categoria?: string;
  local: string;
  data: string;
  detalhes?: string;
  foto?: string | null;
  autor: string;
  donoEmail: string;
  encontrado: boolean;
  ordem: number;
};

export type Mensagem = {
  id: number;
  chave: string;
  autorNome: string;
  autorEmail: string;
  ondeEncontrou: string;
  ondeDeixou: string;
  observacao: string;
  criadaEm: string;
};

async function ler(chave: string): Promise<any[]> {
  try {
    const dados = await AsyncStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.log(`Erro ao ler ${chave}:`, erro);
    return [];
  }
}

// Descobre onde o item foi salvo e qual é o id dele
function origem(chave: string) {
  return {
    armazenamento: chave.startsWith('s-') ? 'solicitacoes' : 'produtosPerdidos',
    id: Number(chave.slice(2)),
  };
}

// Junta solicitações e itens cadastrados numa lista só (mais novos primeiro)
export async function carregarItens(): Promise<Item[]> {
  const solicitacoes = await ler('solicitacoes');
  const produtos = await ler('produtosPerdidos');

  const deSolicitacoes: Item[] = solicitacoes.map((s) => ({
    chave: `s-${s.id}`,
    tipo: 'solicitacao',
    titulo: s.item,
    local: s.local,
    data: s.data,
    detalhes: s.detalhes,
    foto: null,
    autor: s.usuarioNome ?? '',
    donoEmail: s.usuarioEmail ?? '',
    encontrado: !!s.encontrado,
    ordem: s.id,
  }));

  const deProdutos: Item[] = produtos.map((p) => ({
    chave: `p-${p.id}`,
    tipo: 'produto',
    titulo: p.nome,
    categoria: p.categoria,
    local: p.local,
    data: p.data,
    detalhes: p.descricao,
    foto: p.foto ?? null,
    autor: '',
    donoEmail: p.donoEmail ?? '',
    encontrado: !!p.encontrado,
    ordem: p.id,
  }));

  return [...deSolicitacoes, ...deProdutos].sort((a, b) => b.ordem - a.ordem);
}

// Liga/desliga "item encontrado" no lugar onde o item foi salvo
export async function alternarEncontrado(chave: string) {
  const { armazenamento, id } = origem(chave);

  const lista = await ler(armazenamento);
  const nova = lista.map((i) =>
    i.id === id ? { ...i, encontrado: !i.encontrado } : i
  );

  await AsyncStorage.setItem(armazenamento, JSON.stringify(nova));
}

// Apaga o item e as mensagens dele
export async function excluirItem(chave: string) {
  const { armazenamento, id } = origem(chave);

  const lista = await ler(armazenamento);
  await AsyncStorage.setItem(
    armazenamento,
    JSON.stringify(lista.filter((i) => i.id !== id))
  );

  const mensagens = await ler('mensagens');
  await AsyncStorage.setItem(
    'mensagens',
    JSON.stringify(mensagens.filter((m) => m.chave !== chave))
  );
}

export async function carregarMensagens(): Promise<Mensagem[]> {
  return ler('mensagens');
}

export async function salvarMensagem(mensagem: Mensagem) {
  const todas = await carregarMensagens();
  todas.unshift(mensagem);
  await AsyncStorage.setItem('mensagens', JSON.stringify(todas));
}