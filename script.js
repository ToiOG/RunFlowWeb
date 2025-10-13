/* Variavel de controle da ligação entre blocos */
let ligacao = false;
let conectorInicial = null;
let conectorDestino = null;
let ligacoes = [];         

/*Configurações do framework*/
interact("#fluxograma").dropzone({
    accept: ".BlocoInstanciar",
    overlap: 1,
    ondrop(e) {
        const PAINELFLUXOGRAMA = document.getElementById("fluxograma");
        let tamanhoBlocoOriginal = e.relatedTarget.getBoundingClientRect();
        let Coordenadas = PAINELFLUXOGRAMA.getBoundingClientRect();
        let x = e.dragEvent.pageX - Coordenadas.left - (tamanhoBlocoOriginal.width / 2);
        let y = e.dragEvent.pageY - Coordenadas.top - (tamanhoBlocoOriginal.height / 2);
        let BlocoInstanciado = instanciar(e.relatedTarget);

        BlocoInstanciado.style.left = x + "px";
        BlocoInstanciado.style.top = y + "px";

        PAINELFLUXOGRAMA.appendChild(BlocoInstanciado);
    }
});

interact(".BlocoInstanciar").styleCursor(false).draggable({
    listeners: {
        move (e) {
          const target = e.target;

          // pega os dados salvos ou começa em 0
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + e.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + e.dy;

          // aplica a transformação no elemento
          target.style.transform = `translate(${x}px, ${y}px)`;

          // salva a posição nova
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }
      }
    })
    .on('dragend', function(e){
        const target = e.target;

        target.style.transform = "none";
        target.removeAttribute("data-x");
        target.removeAttribute("data-y");
    });

   interact(".BlocoInst").styleCursor(false).draggable({
        listeners: {
            move (e) {
            const target = e.target;

            // pega os dados salvos ou começa em 0
            const x = (parseFloat(target.getAttribute("data-x")) || 0) + e.dx;
            const y = (parseFloat(target.getAttribute("data-y")) || 0) + e.dy;

            // aplica a transformação no elemento
            target.style.transform = `translate(${x}px, ${y}px)`;

            // salva a posição nova
            target.setAttribute("data-x", x);
            target.setAttribute("data-y", y);
            }
        },  
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: "parent"
            })
        ]
   });
/*Termino das configurações do framework*/

/*Blocos de inicio*/
/**/
let blocoProc = document.getElementById("BlcProc");
let cxProc = blocoProc.getContext("2d");

cxProc.fillStyle = "rgb(52, 196, 160)";
cxProc.fillRect(0, 0, 220, 110);

let blocoEntrada = document.getElementById("BlcEntrada");
let cxEntrada = blocoEntrada.getContext("2d");

cxEntrada.fillStyle = "rgb(52, 196, 160)";
cxEntrada.beginPath();
cxEntrada.moveTo(220, 0);
cxEntrada.lineTo(220, 110);
cxEntrada.lineTo(0, 110);
cxEntrada.lineTo(0, 60);
cxEntrada.fill();
cxEntrada.closePath();


let blocoDeci = document.getElementById("BlcDecisao");
let cxDeci = blocoDeci.getContext("2d");

cxDeci.fillStyle = "rgb(52, 196, 160)";
cxDeci.beginPath();
cxDeci.moveTo(0, 65);
cxDeci.lineTo(110, 0);
cxDeci.lineTo(220, 65);
cxDeci.lineTo(110, 130);
cxDeci.fill();
cxDeci.closePath();

let blocoSaida = document.getElementById("BlcSaida");
let cxSaida = blocoSaida.getContext("2d");

cxSaida.fillStyle = "rgb(52, 196, 160)";
cxSaida.beginPath();
cxSaida.moveTo(0, 55);
cxSaida.lineTo(30, 0);
cxSaida.lineTo(190, 0);
//cxSaida.lineTo(190, 110);
cxSaida.arc(190, 55, 55, -Math.PI/2, Math.PI/2);
cxSaida.lineTo(30, 110);
cxSaida.fill();
cxSaida.closePath();

let blocoInicio = document.getElementById("BlcInicio");
let cxInicio = blocoInicio.getContext("2d");

cxInicio.fillStyle = "rgb(52, 196, 160)";
cxInicio.beginPath();
cxInicio.arc(55, 55, 55, Math.PI/2, -Math.PI/2, false);
cxInicio.moveTo(55, 0);
cxInicio.lineTo(110, 0);
cxInicio.arc(190, 55, 55, -Math.PI/2, Math.PI/2);
cxInicio.lineTo(55, 110);
cxInicio.fill();
cxInicio.stroke();
cxInicio.closePath();

let conectInicio = document.createElement("div");
conectInicio.classList.add("Conector", "Baixo");

let imgConectInicio = document.createElement("canvas");
let cxConectInicio = imgConectInicio.getContext("2d");
cxConectInicio.fillStyle = "rgb(52, 196, 160)";
cxConectInicio.beginPath();
cxConectInicio.arc(15, 15, 15, 0, 2 * Math.PI);
cxConectInicio.fill();
cxConectInicio.stroke();
cxConectInicio.closePath();
conectInicio.appendChild(imgConectInicio);

document.querySelector("#Inicio").appendChild(conectInicio)



let blocoFinal = document.getElementById("BlcFinal");
let cxFinal = blocoFinal.getContext("2d");

cxFinal.fillStyle = "rgb(52, 196, 160)";
cxFinal.beginPath();
cxFinal.arc(55, 55, 55, Math.PI/2, -Math.PI/2, false);
cxFinal.moveTo(55, 0);
cxFinal.lineTo(110, 0);
cxFinal.arc(190, 55, 55, -Math.PI/2, Math.PI/2);
cxFinal.lineTo(55, 110);
cxFinal.fill();
cxFinal.stroke();
cxFinal.closePath();


let conectFinal = document.createElement("div");
conectFinal.classList.add("Conector", "Cima");

let imgConectFinal = document.createElement("canvas");
let cxConectFinal = imgConectFinal.getContext("2d");
cxConectFinal.fillStyle = "rgb(52, 196, 160)";
cxConectFinal.beginPath();
cxConectFinal.arc(15, 15, 15, 0, 2 * Math.PI);
cxConectFinal.fill();
cxConectFinal.stroke();
cxConectFinal.closePath();
conectFinal.appendChild(imgConectFinal);

document.querySelector("#Final").appendChild(conectFinal)


/*Fim dos blocos de inicio*/

function instanciar(target) {
    let idBloco = target.id;
    let bloco = document.createElement("div");

    let conect1 = document.createElement("div");
    let conect2 = document.createElement("div");
    conect1.style.width = "30px";
    conect1.style.height = "30px";
    conect2.style.width = "30px";
    conect2.style.height = "30px";


    conect1.classList.add("Conector", "Cima");
    conect2.classList.add("Conector", "Baixo");
    let imgConect1 = document.createElement("canvas");
    let cxConect1 = imgConect1.getContext("2d");
    cxConect1.fillStyle = "rgb(52, 196, 160)";
    cxConect1.beginPath();
    cxConect1.arc(15, 15, 15, 0, 2 * Math.PI);
    cxConect1.fill();
    cxConect1.stroke();
    cxConect1.closePath();
    conect1.appendChild(imgConect1);

    let imgConect2 = document.createElement("canvas");
    let cxConect2 = imgConect2.getContext("2d");
    cxConect2.fillStyle = "rgb(52, 196, 160)";
    cxConect2.beginPath();
    cxConect2.arc(15, 15, 15, 0, 2 * Math.PI);
    cxConect2.fill();
    cxConect2.stroke();
    cxConect2.closePath();
    conect2.appendChild(imgConect2);

    bloco.appendChild(conect1);
    bloco.appendChild(conect2);
    bloco.style.width = "160px";
    bloco.style.height = "81px";
    switch (idBloco) {
        case "ProcessamentoInit":
            {
                bloco.classList.add("Processamento", "BlocoInst");

                let img = document.createElement("canvas");
                let cxProc = img.getContext("2d");
                cxProc.fillStyle = "rgb(52, 196, 160)";
                cxProc.fillRect(0, 20, 220, 110);
                cxProc.strokeRect(0, 20, 220, 110);

                img.classList.add("ImgBlc");

                bloco.appendChild(img);
            }
            break;
        case "EntradaInit":
            {
                bloco.classList.add("Entrada", "BlocoInst");

                let img = document.createElement("canvas");
                let cxEntrada = img.getContext("2d");

                cxEntrada.fillStyle = "rgb(52, 196, 160)";
                cxEntrada.beginPath();
                cxEntrada.moveTo(160, 0);
                cxEntrada.lineTo(160, 81);
                cxEntrada.lineTo(0, 81);
                cxEntrada.lineTo(0, 40);
                cxEntrada.lineTo(160, 0);
                cxEntrada.fill();  
                cxEntrada.stroke();

                bloco.appendChild(img);
            }
            break;
        case "DecisaoInit":
            {
                bloco.style.height = "120px";
                bloco.classList.add("Decisao", "BlocoInst");

                let img = document.createElement("canvas");
                let cxDeci = img.getContext("2d");
                cxDeci.fillStyle = "rgb(52, 196, 160)";
                cxDeci.beginPath();
                cxDeci.moveTo(0, 60);
                cxDeci.lineTo(80, 0);
                cxDeci.lineTo(160, 60);
                cxDeci.lineTo(80, 120);
                cxDeci.lineTo(0, 60);
                cxDeci.fill();
                cxDeci.stroke();

                bloco.appendChild(img);

                conect2.style.left = "0";
                conect2.style.top = "43px";

                let conect3 = document.createElement("div");
                conect3.style.width = "30px";
                conect3.style.height = "30px";
                conect3.style.left = "130px";
                conect3.style.top = "43px";

                conect3.classList.add("Conector");
                let imgConect3 = document.createElement("canvas");
                let cxConect3 = imgConect3.getContext("2d");
                cxConect3.fillStyle = "rgb(52, 196, 160)";
                cxConect3.beginPath();
                cxConect3.arc(15, 15, 15, 0, 2 * Math.PI);
                cxConect3.fill();
                cxConect3.stroke();
                cxConect3.closePath();
                conect3.appendChild(imgConect3);
                bloco.appendChild(conect3);
            }
            break;
        case "SaidaInit":
            {
                bloco.style.width = "185px";
                bloco.classList.add("Saida", "BlocoInst");

                let img = document.createElement("canvas");
                let cxSaida = img.getContext("2d");

                cxSaida.fillStyle = "rgb(52, 196, 160)";
                cxSaida.beginPath();
                cxSaida.moveTo(0, 40);
                cxSaida.lineTo(30, 0);
                cxSaida.lineTo(150, 0);
                cxSaida.arc(150, 40, 40, -Math.PI/2, Math.PI/2);
                cxSaida.lineTo(30, 80);
                cxSaida.lineTo(0, 40);
                cxSaida.fill();
                cxSaida.stroke();

                bloco.appendChild(img);
                }
            break;
    }
    return bloco;
}

//Função em desenvolvimento
/*
function ligarBloco(e) {
    if (!ligacao) {
        ligacao = true;
        e.target.classList.add("LigacaoAtiva");
        if (e.target.classList.contains(".Cima")) {
            conectorInicial = e.target;
            conectorDestino = null;
        } else {
            conectorDestino = e.target;
            conectorInicial = null;
        }
    } else {
        if (e.target.classList.contains(".Cima") && conectorInicial!=null) {
            ligacao = false;
            conectorInicial.parentElement.setAttribute("BlocoProximo", e.target);
            e.target.parentElement.setAttribute("BlocoAnterior", conectorInicial);
        } else if (e.target.classList.contains(".Baixo") && conectorDestino!=null){
            ligacao = false;
            conectorDestino.parentElement.setAttribute("BlocoProximo", e.target);
            e.target.parentElement.setAttribute("BlocoAnterior", conectorDestino);
        }
    }

}

function executarLigacao(e) {
    if (e.target.classList.contains("")) {}
}
//fim dos blocos*/
