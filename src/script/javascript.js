function visorInsercao() {return document.getElementById("visor-insercao")}
function visorResultado() {return document.getElementById("visor-resultado")}

let Memoria = 0;

function inserirValores(valor) {
    visorInsercao().innerHTML += valor;
    RemoverPontoInicial();
    RemoverZeroDuploInicial();
}

function apagarResultadoDigito() {
    visorInsercao().innerHTML = ""; 
    visorResultado().innerHTML = "0";
}

function apagarDigito() {
    var textoAtual = visorInsercao().innerHTML;
    visorInsercao().innerHTML = textoAtual.slice(0, -1);
}

function normalizarExpressoes(expressao) {
    expressao = expressao.replace(/x/g, '*');
    expressao = expressao.replace(/%/g, '/100*');
    expressao = expressao.replace(/√(\d+)/g, 'Math.sqrt($1)');
    return expressao;
}

function RemoverPontoInicial() {
    const conteudoVisor = visorInsercao().innerText;

    if (conteudoVisor.startsWith(".")) {
        visorInsercao().innerText = "";
        console.log("Não é permitido . no início da operação.");
    }
}

function RemoverZeroDuploInicial() {
    const conteudoVisor = visorInsercao().innerText;

    if (/^0\d/.test(conteudoVisor)) {
        visorInsercao().innerText = conteudoVisor.replace(/^0+/, "0");
        console.log("Não é permitido mais de um zero à esquerda.");
      }
}

function calcular() {
    let expressao = visorInsercao().innerHTML;

    if (expressao) {
        try {
            expressao = normalizarExpressoes(expressao);
            let resultado = eval(expressao);

            visorResultado().innerHTML = resultado;
            RespostaGuardada = resultado;
            visorInsercao().innerHTML = "";
        } catch (e) {
            visorResultado().innerHTML = "Erro"; 
        }
    }
}

function LogMemoria() {return console.log(`Memória armazenada: ${Memoria}`);}

function AtualizarIndicadorMemoria() {
    const indicador = document.getElementById("visor-memoria");
    if (indicador !== 0) {
        indicador.style.color = "#096b3d";
    } else {
        indicador.style.color = "#64b47c";
    }
}

function AdicionarMemoria() {
    Memoria += parseFloat(visorResultado().innerHTML);
    AtualizarIndicadorMemoria();
    LogMemoria();
}

function SubtrairMemoria() {
    Memoria -= parseFloat(visorResultado().innerHTML);
    AtualizarIndicadorMemoria();
    LogMemoria();
}

function RecuperarMemoria() {
    visorResultado().innerHTML = Memoria;
    AtualizarIndicadorMemoria();
    LogMemoria();
}

function ApagarMemoria() {
    Memoria = 0;
    AtualizarIndicadorMemoria();
    LogMemoria();
}