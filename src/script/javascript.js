function visorInsercao() {return document.getElementById("visor-insercao");}
function visorResultado() {return document.getElementById("visor-resultado");}

function inserirValores(valor) {
    visorInsercao().value += valor;

    RemoverPontoInicial();
    RemoverZeroDuploInicial();

    if ((/\.\./.test(visorInsercao().value))||(/\,\,/.test(visorInsercao().value))) {
        exibirAviso("Não é permitido inserir dois pontos consecutivos.");
        apagarDigito(); 
    }

    if (ChecarSinaisDuplos()) {
        exibirAviso("Não é possível inserir sinais duplicados.");
        apagarSinalDuplo(); 
    }
}

function tratandoNaN() {
    if (visorResultado().innerHTML === "NaN") {
        visorResultado().innerHTML = "Undefined";
    }
}

function inserirRespostaAnterior() {
    visorInsercao().value += RespostaGuardada;
}

function apagarResultado() {
    visorInsercao().value = ""; 
    visorResultado().innerHTML = "0";
}

function apagarDigito() {
    var textoAtual = visorInsercao();
    textoAtual.value = textoAtual.value.slice(0, -1);
}

function apagarSinalDuplo() {
    var textoAtual = visorInsercao();
    textoAtual.value = textoAtual.value.slice(0, -3);
}

function tratarExpressoes(expressao) {
    const substituicoes = [
        // Multiplicação (x → *)
        {regex: /\bx\b/g,
            to: '*'},

        // Descobrir porcentagem (x%?y -> x * y / 100)
        {regex: /(-?\d+(\.\d+)?)%\?(-?\d+(\.\d+)?)/g, 
            to: '($1 * $2 / 100)'},

        // Porcentagem (% → /100*)
        {regex: /%/g, 
            to: '/100*'},

        // Resto da divisão (rest → %)
        {regex: /rest/g, 
            to: '%'},

        // Raiz enésima (nⁿ√x)
        {regex: /(-?\d+(\.\d+)?)ⁿ√\s*(-?\d+(\.\d+)?)/g,
            to: 'Math.pow($3, 1/$1)'},

        // Raiz cúbica (³√x)
        {regex: /³√\s*(-?\d+(\.\d+)?)/g, 
            to: 'Math.cbrt($1)'},

        // Raiz quadrada (√x)
        {regex: /√\s*(-?\d+(\.\d+)?)/g, 
            to: 'Math.sqrt($1)'},

        // Potência genérica (x^)
        {regex: /(-?\d+(\.\d+)?)\^(-?\d+(\.\d+)?)/g, 
            to: 'Math.pow($1, $3)'},

        // Potência ao quadrado (x²)
        {regex: /(-?\d+(\.\d+)?)²/g, 
            to: 'Math.pow($1, 2)'},

        // Potência ao cubo (x³)
        {regex: /(-?\d+(\.\d+)?)³/g, 
            to: 'Math.pow($1, 3)'},

        // Potência com expoente negativo (x^-n)
        {regex: /(-?\d+(\.\d+)?)\^-(-?\d+(\.\d+)?)/g, 
            to: 'Math.pow($1, -($3))'},

        // Inverso multiplicativo (x^-1)
        {regex: /(-?\d+(\.\d+)?)\^-1/g, 
            to: 'Math.pow($1, -1)'},

        // Fatorial (x!)
        {regex: /(-?\d+(\.\d+)?)!/g, 
            to: 'fatorial($1)'},

        // Logaritmo natural (ln(x))
        {regex: /ln\((-?\d+(\.\d+)?)\)/g, 
            to: 'Math.log($1)'},

        // Logaritmo binário (lb(x) -> log base 2)
        {regex: /lb\((-?\d+(\.\d+)?)\)/g, 
            to: '(Math.log($1) / Math.log(2))'},

        // Logaritmo Comum
        {regex: /log\(\s*(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)\s*\)/g,
            to: '($1 > 0 && $1 !== 1 && $3 > 0 ? Math.log($3) / Math.log($1) : NaN)'},

        // Antilogaritmo natural (eˣ)
        {regex: /e\^\s*(-?\d+(\.\d+)?)/g, 
            to: 'Math.exp($1)'},

        // Antilogaritmo comum (10ˣ)
        {regex: /10\^\s*(-?\d+(\.\d+)?)/g, 
            to: 'Math.pow(10, $1)'},

        // Logaritmo de Base 10
        {regex: /log10\((-?\d+(\.\d+)?)\)/g, 
            to: 'Math.log10($1)'},

        // Seno
        {regex: /sin\((-?\d+(\.\d+)?)\)/g, 
            to: 'Math.sin($1)'},

        // Cosseno
        {regex: /cos\((-?\d+(\.\d+)?)\)/g, 
            to: 'Math.cos($1)'},

        // Tangente
        {regex: /tan\((-?\d+(\.\d+)?)\)/g, 
            to: 'Math.tan($1)'},

        // Cotangente
        {regex: /cot\((-?\d+(\.\d+)?)\)/g, 
            to: '(1 / Math.tan($1))'},

        // Secante
        {regex: /sec\((-?\d+(\.\d+)?)\)/g,
            to: '(1 / Math.cos($1))'},

        // Cossecante
        {regex: /csc\((-?\d+(\.\d+)?)\)/g, 
            to: '(1 / Math.sin($1))'},

        // Arco Seno [−1,1]
        {regex: /asin\((-?\d+(\.\d+)?|0?\.\d+)\)/g,
            to: 'Math.asin($1)'},

        // Arco Cosseno [−1,1]
        {regex: /acos\((-?\d+(\.\d+)?|0?\.\d+)\)/g, 
            to: 'Math.acos($1)'},

        // Arco Tangente
        {regex: /atan\((-?\d+(\.\d+)?|0?\.\d+)\)/g, 
            to: 'Math.atan($1)'},

        // Arco Secante [−1,1]
        {regex: /asec\((-?\d+(\.\d+)?|0?\.\d+)\)/g, 
            to: 'x => x >= 1 || x <= -1 ? Math.acos(1 / x) : tratandoNaN()'},

        // Arco Cotangente
        {regex: /acot\((-?\d+(\.\d+)?|0?\.\d+)\)/g, 
            to: 'x => x !== 0 ? Math.atan(1 / x) : tratandoNan()'},

        // Arco Cossecante [−1,1]
        {regex: /acsc\((-?\d+(\.\d+)?|0?\.\d+)\)/g, 
            to: 'x => x >= 1 || x <= -1 ? Math.asin(1 / x) : tratandoNan()'},

        // // Grau para Radiano
        // {regex: /g\((-?\d+(\.\d+)?)\)/g, 
        //     to: '$1 * (Math.PI/180)'},
            
        // // Radiano para Grau
        // {regex: /rad\((-?\d+(\.\d+)?)\)/g,
        //     to: '$1 * (180/Math.PI)'},
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
    const visor = visorInsercao();
    if (visor.value.startsWith(".")||visor.value.startsWith(",")) {
        visor.value = "";
        exibirAviso("Não é permitido . no início da operação.");
    }
}

function RemoverZeroDuploInicial() {
    const visor = visorInsercao();
    if (/^0\d/.test(visor.value)) {
        visor.value = visor.value.replace(/^0+/, "0");
        exibirAviso("Não é permitido mais de um zero à esquerda.");
    }
}

const SinaisDuplos = [/\+  \+/, /-  -/, /\/  \//, /x  x/, /%  %/];

function ChecarSinaisDuplos() {
    const conteudoVisor = visorInsercao().value;

    for (let regex of SinaisDuplos) {
        regex.lastIndex = 0;
        if (regex.test(conteudoVisor)) {
            return true;
        }
    }
    return false;
}

function calcular() {
    let expressao = visorInsercao().value;

    if ((expressao === "🐘🍓")||(expressao === "🍓🐘")) {
        visorResultado().innerText = "misericordia";
        visorInsercao().value = ""; 
        return;
    }

    if (expressao) {
        try {
            expressao = tratarExpressoes(expressao);
            let resultado = eval(expressao);

            visorResultado().innerText = resultado;
            RespostaGuardada = resultado;

            visorInsercao().value = "";

            tratandoNaN();
        } catch {
            visorResultado().innerText = "Erro";
        }
    }
    return RespostaGuardada;
}

visorInsercao().addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        calcular();
    }
});

let Memoria = 0;

function LogMemoria() {return console.log(`Memória armazenada: ${Memoria}`);}

function AtualizarIndicadorMemoria() {
    const indicador = document.getElementById("visor-memoria");
    if (Memoria !== 0) {
        indicador.classList.add("com-memoria");
    } else {
        indicador.classList.remove("com-memoria");
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
    visorInsercao().value += Memoria;
    RemoverZeroDuploInicial();
    AtualizarIndicadorMemoria();
    LogMemoria();
}

function ApagarMemoria() {
    Memoria = 0;
    AtualizarIndicadorMemoria();
    LogMemoria();
}

function exibirAviso(mensagem) {
    const divAvisos = document.getElementById("avisos");
    const paragrafoAviso = document.getElementById("paragrafo-aviso");

    divAvisos.style.opacity = "1";
    divAvisos.style.color = "#fff";
    paragrafoAviso.innerText = mensagem;

    setTimeout(() => {
        divAvisos.style.opacity = "0";
        setTimeout(() => {
            paragrafoAviso.innerText = "aviso";
        }, 500); 
    }, 2000);
}

function iconConfiguracoes() {return document.getElementById("icon-configuracao");}
function iconFecharConfiguracoes() {return document.getElementById("fechar-configuracao");}
function divConfiguracoes() {return document.getElementById("configuracoes");}

function iconHistorico() {return document.getElementById("icon-historico");}
function iconFecharHistorico() {return document.getElementById("fechar-historico");}
function divHistorico() {return document.getElementById("historico");}

iconConfiguracoes().addEventListener("click", () => {
    divConfiguracoes().style.display = "block";
});

iconFecharConfiguracoes().addEventListener("click", () => {
    divConfiguracoes().style.display = "none";
});

iconHistorico().addEventListener("click", () => {
    divHistorico().style.display = "block";
});

iconFecharHistorico().addEventListener("click", () => {
    divHistorico().style.display = "none";
});

const seletorTemas = document.getElementById("temas");
const ListaTemas = [
    "tema-padrao",
    "tema-madoka",
    "tema-homura",
    "tema-sunflower"
];

seletorTemas.addEventListener("change", (e) => {
    const temaSelecionado = e.target.value;

    document.body.classList.remove(...ListaTemas);
    document.body.classList.add(`tema-${temaSelecionado || "padrao"}`);
});

function Misericordia() {
    if (visorResultado().innerHTML === "🐘🍓") {
        visorResultado().innerHTML = "Misericordia";
    }
}