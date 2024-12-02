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

function calcular() {
    var expressao = visorInsercao().innerHTML;

    if (expressao) {
        try {
            let resultado = eval(expressao);
            visorResultado().innerHTML = resultado;
            visorInsercao().innerHTML = "";
        } catch (e) {
            visorResultado().innerHTML = "Erro"; 
        }
    }
}