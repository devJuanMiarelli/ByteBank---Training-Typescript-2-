import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0;
const transacoes: Array<Transacao> = JSON.parse(localStorage.getItem("transacoes"), (key: string, value: string) => {
    if(key === "data") {
        return new Date(value);
    }

    return value;
}) || [];

function debitar(valor: number): void {
    if(valor <= 0) {
        throw new Error("O valor deve ser maior que zero!");
    }
    if(valor > saldo) {
        throw new Error("Saldo insuficiente!");
    }
    saldo -= valor;
    localStorage.setItem("saldo", saldo.toString());
}

function depositar(valor: number): void{
    if(valor <= 0) {
        throw new Error("O valor deve ser maior ou igual a zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", saldo.toString());
}


const Conta = {
    getSaldo() {
        return saldo;
    },

    getDataAcesso(): Date {
        return new Date();
    },

    getGruposTransacoes(): Array<GrupoTransacao> {
        const gruposTransacoes: Array<GrupoTransacao> = [];
        const listaTransacoes: Array<Transacao> = structuredClone(transacoes); // copia toda a estrutura do objeto e gera uma nova referência.
        const transacoesOrdenadas: Array<Transacao> = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime());
        let labelAtualGrupoTransacao: string = "";
        
        for(let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-br", {month: "long", year: "numeric"});
            if(labelAtualGrupoTransacao != labelGrupoTransacao) {
                labelAtualGrupoTransacao = labelGrupoTransacao;
                gruposTransacoes.push({
                    label: labelGrupoTransacao,
                    transacoes: []
                });
            }
            gruposTransacoes.at(-1).transacoes.push(transacao);
        }

        return gruposTransacoes;
    },

    registrarTransacao(novaTransacao: Transacao): void {
        if(novaTransacao.tipoTransacao == TipoTransacao.DEPOSITO) {
            depositar(novaTransacao.valor);
        } else if(novaTransacao.tipoTransacao == TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao == TipoTransacao.PGTO_BOLETO) {
            debitar(novaTransacao.valor);
            novaTransacao.valor *= -1;
        } else {
            throw new Error("Transação inválida!");
        }

        transacoes.push(novaTransacao);
        console.log(this.getGruposTransacoes());
        localStorage.setItem("transacoes", JSON.stringify(transacoes));
    }
}

export default Conta;

