import { Item } from './item';

export interface Orcamento {
    orcamentoId: number;
    clienteId: number;
    dataOrcamento: Date;
    dataAlteracao: Date;
    usuarioCriacao: string;
    usuarioAlteracao: string;
    valorTotal: string;
    valorDesconto: string;
    situacao: boolean;

    listItemOrcamento: Item[];
}
