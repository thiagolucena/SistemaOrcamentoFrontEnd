import { Orcamento } from './orcamento';

export interface Item {    
    itemId: number;
    valor: string;
    ativo: boolean;
    descricao: string;
    listItemOrcamento: Orcamento[];
}
