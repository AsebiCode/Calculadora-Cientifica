function visorInsercao() {return document.getElementById("visor-insercao")}
function visorResultado() {return document.getElementById("visor-resultado")}

function inserirValores(valor) {
    visorInsercao().innerHTML += valor;
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