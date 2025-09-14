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
        }
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


let blocoDeci = document.getElementById("BlcDecisao");
let cxDeci = blocoDeci.getContext("2d");

cxDeci.fillStyle = "rgb(52, 196, 160)";
cxDeci.beginPath();
cxDeci.moveTo(0, 65);
cxDeci.lineTo(110, 0);
cxDeci.lineTo(220, 65);
cxDeci.lineTo(110, 130);
cxDeci.fill();

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

/*Fim dos blocos de inicio*/

function instanciar(target) {
    let idBloco = target.id;
    let bloco = document.createElement("div");
    switch (idBloco) {
        case "ProcessamentoInit":
            {
                bloco.classList.add("Processamento", "BlocoInst");

                let img = document.createElement("canvas");
                let cxProc = img.getContext("2d");
                cxProc.fillStyle = "rgb(52, 196, 160)";
                cxProc.fillRect(0, 0, 220, 110);
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
                cxEntrada.moveTo(220, 0);
                cxEntrada.lineTo(220, 110);
                cxEntrada.lineTo(0, 110);
                cxEntrada.lineTo(0, 60);
                cxEntrada.fill();

                bloco.appendChild(img);
            }
            break;
        case "DecisaoInit":
            {
                bloco.classList.add("Decisao", "BlocoInst");

                let img = document.createElement("canvas");
                let cxDeci = img.getContext("2d");
                cxDeci.fillStyle = "rgb(52, 196, 160)";
                cxDeci.beginPath();
                cxDeci.moveTo(0, 65);
                cxDeci.lineTo(110, 0);
                cxDeci.lineTo(220, 65);
                cxDeci.lineTo(110, 130);
                cxDeci.fill();

                bloco.appendChild(img);
            }
            break;
        case "SaidaInit":
            {
                bloco.classList.add("Saida", "BlocoInst");

                let img = document.createElement("canvas");
                let cxSaida = img.getContext("2d");

                cxSaida.fillStyle = "rgb(52, 196, 160)";
                cxSaida.beginPath();
                cxSaida.moveTo(0, 55);
                cxSaida.lineTo(30, 0);
                cxSaida.lineTo(190, 0);
                cxSaida.arc(190, 55, 55, -Math.PI/2, Math.PI/2);
                cxSaida.lineTo(30, 110);
                cxSaida.fill();

                bloco.appendChild(img);
                }
            break;
    }
    return bloco;
    
}
//fim dos blocos
