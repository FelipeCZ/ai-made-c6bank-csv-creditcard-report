export interface Transaction {
  id: string;
  dataCompra: string;
  nomeCartao: string;
  finalCartao: string;
  categoria: string;
  descricao: string;
  parcela: string;
  valorUSD: number;
  cotacao: number;
  valorBRL: number;
  categoriaCustom?: string;
}
