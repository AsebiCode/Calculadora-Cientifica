function inserirValores(valor) {
    var visor = document.getElementsByClassName('visor-insercao')[0]
    visor.innerHTML += valor
}

function apagarResultadoDigito() {
    document.getElementsByClassName('visor-insercao')[0].innerHTML = ""
    document.getElementsByClassName('visor-resultado')[0].innerHTML = "0"
}

function apagarDigito() {
    var visor = document.getElementsByClassName('visor-insercao')[0]
    var textoAtual = visor.innerHTML;
    visor.innerHTML = textoAtual.substring(0, textoAtual.length - 1);
}

function calcular() {
    var visorResultado = document.getElementsByClassName('visor-resultado')[0];
    var visorInsercao = document.getElementsByClassName('visor-insercao')[0].innerHTML;

    if (visorInsercao) {
        try {
            visorResultado.innerHTML = eval(visorInsercao);
        } catch (e) {
            visorResultado.innerHTML = "Erro";
        }
    }
}