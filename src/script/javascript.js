function visorInsercao() {return document.getElementById("visor-insercao")}
function visorResultado() {return document.getElementById("visor-resultado")}

function inserirValores(valor) {
    visorInsercao().innerHTML += valor;
    RemoverPontoInicial();
    RemoverZeroDuploInicial();

    if (/\.\./.test(visorInsercao().innerText)) {
        console.log("Não é permitido inserir dois pontos consecutivos.");
        apagarDigito();
    }

    if (ChecarSinaisDuplos()) {
        console.log("Não é possível inserir sinais duplicados.");
        apagarSinalDuplo();
    }
}

function inserirRespostaAnterior() {
    visorInsercao().innerHTML += RespostaGuardada;
}

function apagarResultadoDigito() {
    visorInsercao().innerHTML = ""; 
    visorResultado().innerHTML = "0";
}

function apagarDigito() {
    var textoAtual = visorInsercao().innerHTML;
    visorInsercao().innerHTML = textoAtual.slice(0, -1);
}

function apagarSinalDuplo() {
    var textoAtual = visorInsercao().innerHTML;
    visorInsercao().innerHTML = textoAtual.slice(0, -3);
}

function normalizarExpressoes(expressao) {
    const substituicoes = [
        // Multiplicação (x → *)
        {regex: /\bx\b/g, to: '*'},
        // Descobrir porcentagem (x%?y -> x * y / 100)
        {regex: /(-?\d+(\.\d+)?)%\?(-?\d+(\.\d+)?)/g, to: '($1 * $2 / 100)'},
        // Porcentagem (% → /100*)
        {regex: /%/g, to: '/100*'},
        // Resto da divisão (rest → %)
        {regex: /rest/g, to: '%'},
        // Raiz enésima (nⁿ√x)
        {regex: /(-?\d+(\.\d+)?)ⁿ√\s*(-?\d+(\.\d+)?)/g, to: 'Math.pow($3, 1/$1)'},
        // Raiz cúbica (³√x)
        {regex: /³√\s*(-?\d+(\.\d+)?)/g, to: 'Math.cbrt($1)'},
        // Raiz quadrada (√x)
        {regex: /√\s*(-?\d+(\.\d+)?)/g, to: 'Math.sqrt($1)'},
        // Potência genérica (xⁿ)
        {regex: /(-?\d+(\.\d+)?)ⁿ(-?\d+(\.\d+)?)/g, to: 'Math.pow($1, $3)'},
        // Potência ao quadrado (x²)
        {regex: /(-?\d+(\.\d+)?)²/g, to: 'Math.pow($1, 2)'},
        // Potência ao cubo (x³)
        {regex: /(-?\d+(\.\d+)?)³/g, to: 'Math.pow($1, 3)'},
        // Potência com expoente negativo (x⁻ⁿ)
        {regex: /(-?\d+(\.\d+)?)⁻ⁿ(-?\d+(\.\d+)?)/g, to: 'Math.pow($1, -($3))'},
        // Inverso multiplicativo (x⁻¹)
        {regex: /(-?\d+(\.\d+)?)⁻¹/g, to: 'Math.pow($1, -1)'},
        // Fatorial (x!)
        {regex: /(-?\d+(\.\d+)?)!/g, to: 'fatorial($1)'},
        // Logaritmo comum (log base x -> log(y)/log(x))
        {regex: /log\((-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\)/g, to: '(Math.log($2) / Math.log($1))'},
        // Logaritmo natural (ln(x))
        {regex: /ln\((-?\d+(\.\d+)?)\)/g, to: 'Math.log($1)'},
        // Logaritmo binário (lb(x) -> log base 2)
        {regex: /lb\((-?\d+(\.\d+)?)\)/g, to: '(Math.log($1) / Math.log(2))'},
        // Antilogaritmo natural (eˣ)
        {regex: /e\^\s*(-?\d+(\.\d+)?)/g, to: 'Math.exp($1)'},
        // Antilogaritmo comum (10ˣ)
        {regex: /10\^\s*(-?\d+(\.\d+)?)/g, to: 'Math.pow(10, $1)'}
    ];

    console.log("Expressão normalizada: ", expressao);
    return substituicoes.reduce((acc, { regex, to }) => acc.replace(regex, to), expressao);
}

function fatorial(numero) {
    if (numero % 1 !== 0) {
        // Para números decimais, é usado a aproximação pela função Gamma
        return gamma(numero + 1);
    }
    let resultado = 1;
    for (let i = 1; i <= numero; i++) {
        resultado *= i;
    }
    return resultado;
}

// Função Gamma para fatorial de decimais
function gamma(z) {
    const g = 7;
    const p = [
        0.99999999999980993,
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];

    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }

    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
        x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
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

const SinaisDuplos = [/\+\+/, /--/, /\/\//, /x\s*x/];

function ChecarSinaisDuplos() {
    const conteudoVisor = visorInsercao().innerText;

    for (let regex of SinaisDuplos) {
        regex.lastIndex = 0;
        if (regex.test(conteudoVisor)) {
            return true;
        }
    }
    return false;
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
    return RespostaGuardada;
}

let Memoria = 0;

function LogMemoria() {return console.log(`Memória armazenada: ${Memoria}`);}

function AtualizarIndicadorMemoria() {
    const indicador = document.getElementById("visor-memoria");
    if (Memoria !== 0) {
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
    visorInsercao().innerHTML = Memoria;
    AtualizarIndicadorMemoria();
    LogMemoria();
}

function ApagarMemoria() {
    Memoria = 0;
    AtualizarIndicadorMemoria();
    LogMemoria();
}