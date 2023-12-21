import { TipoTransacao } from "../types/TipoTransacao.js";

export type Transacao = {
    tipoTransacao: TipoTransacao,
    valor: number,
    data: Date
}