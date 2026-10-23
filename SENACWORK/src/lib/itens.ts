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
    ordem: p.id,
  }));

  return [...deSolicitacoes, ...deProdutos].sort((a, b) => b.ordem - a.ordem);
}

export async function carregarMensagens(): Promise<Mensagem[]> {
  return ler('mensagens');
}

export async function salvarMensagem(mensagem: Mensagem) {
  const todas = await carregarMensagens();
  todas.unshift(mensagem);
  await AsyncStorage.setItem('mensagens', JSON.stringify(todas));
}