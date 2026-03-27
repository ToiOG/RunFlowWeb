/*Configurações estáticas*/
interact("#fluxograma").dropzone({
    accept: ".BlocoInstanciar",
    overlap: 1,
    ondrop(e) {
        const PAINELFLUXOGRAMA = document.getElementById("fluxograma");
        let tamanhoBlocoOriginal = e.relatedTarget.getBoundingClientRect();
        let Coordenadas = PAINELFLUXOGRAMA.getBoundingClientRect();
        let x = e.dragEvent.pageX - Coordenadas.left - (tamanhoBlocoOriginal.width / 2);
        let y = e.dragEvent.pageY - Coordenadas.top - (tamanhoBlocoOriginal.height / 2);
        instanciar(e.relatedTarget, x, y);
    }
});

interact(".BlocoInstanciar").styleCursor(false).draggable({
    listeners: {
        move(e) {
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
    .on('dragend', function (e) {
        const target = e.target;

        target.style.transform = "none";
        target.removeAttribute("data-x");
        target.removeAttribute("data-y");
    });

interact(".BlocoInst").styleCursor(false).draggable({
    listeners: {
        move(e) {
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
/*Fim do Iteract
---------------------------------
Inicio do X6 antV*/
const graph = new X6.Graph({
    container: document.getElementById('fluxograma'),
    grid: true,
    mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        minScale: 0.5,
        maxScale: 3,
    },
    selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        showNodeSelectionBox: true,
        modifiers: 'shift',
    },
    panning: {
        enabled: true,
    },
    connecting: {
        router: 'orth',
        connector: {
            name: 'rounded',
            args: {
                radius: 8,
            },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
            radius: 20,
        },
        createEdge() {
            return new X6.Shape.Edge({
                attrs: {
                    line: {
                        stroke: '#A2B1C3',
                        strokeWidth: 2,
                        targetMarker: {
                            name: 'block',
                            width: 12,
                            height: 8,
                        },
                    },
                },
                zIndex: 0,
            })
        },
        validateConnection({ targetMagnet }) {
            return !!targetMagnet
        },
        validateEdge({ sourceCell, targetCell }) {
            if ((sourceCell && targetCell && sourceCell.id === targetCell.id)) {
                return false
            }
            return true
        },
    },
    highlighting: {
        magnetAdsorbed: {
            name: 'stroke',
            args: {
                attrs: {
                    fill: '#5F95FF',
                    stroke: '#5F95FF',
                },
            },
        },
    },
}).on('edge:connected', ({ edge }) => {
    const sourceNode = edge.getSourceCell();

    if (sourceNode.shape !== "decisao") return;

    const portId = edge.getSourcePortId();
    const port = sourceNode.getPort(portId);

    if (port.group == "verdadeiro") {
        edge.setLabels([{
            attrs: {
                label: {
                    text: "Verdadeiro"
                }
            }
        }
        ]);
    }

    if (port.group == "falso") {
        edge.setLabels([{
            attrs: {
                label: {
                    text: "Falso"
                }
            }
        }
        ]);
    }
});

const fluxograma = document.getElementById('fluxograma')
fluxograma.tabIndex = 0

fluxograma.addEventListener('mousedown', () => {
    fluxograma.focus()
})

document.addEventListener('keydown', (e) => {
    if (document.activeElement !== fluxograma) return

    if (e.key === 'Delete') {
        e.preventDefault()
        deletar()
    }
})

function deletar() {
    const cells = graph.getSelectedCells()
    if (cells.length) {
        if (cells.find(bloco => bloco.id === 'terminalInicio') || cells.find(bloco => bloco.id === 'terminalFinal')) {
            alert("Não é possivel deletar os blocos terminais!")
        } else {
            graph.removeCells(cells)
        }
    }
}

const ports = {
    groups: {
        top: {
            position: 'top',
            attrs: {
                circle: {
                    r: 4,
                    magnet: 'passive',
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
        topEntrada: {
            position: {
                name: 'absolute',
                args: { x: 75, y: 20 }
            },
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
        right: {
            position: 'right',
            attrs: {
                circle: {
                    r: 4,
                    magnet: 'passive',
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
        verdadeiro: {
            position: 'right',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
        bottom: {
            position: 'bottom',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
        left: {
            position: 'left',
            attrs: {
                circle: {
                    r: 4,
                    magnet: 'passive',
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
        falso: {
            position: 'left',
            attrs: {
                circle: {
                    r: 4,
                    magnet: true,
                    stroke: '#5F95FF',
                    strokeWidth: 1,
                    fill: '#fff',
                    style: {
                        visibility: true,
                    },
                },
            },
        },
    },
    items: [
        {
            group: 'top',
        },
        {
            group: 'topEntrada',
        },
        {
            group: 'right',
        },
        {
            group: 'bottom',
        },
        {
            group: 'left',
        },
        {
            group: 'verdadeiro',
        },
        {
            group: 'falso',
        },
    ],
}



X6.Shape.Rect.define({
    shape: 'processamento',
    width: 150,
    height: 80,
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
            rx: 10,
            ry: 10,
        },
        text: {
            text: 'Processamento',
            fill: '#000',
            fontSize: 16,
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'top' || port.group == 'bottom'),
    },
});

X6.Shape.Polygon.define({
    shape: 'entrada',
    width: 150,
    height: 80,
    points: '0,45 150,0 150,80 0,80',
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
        },
        label: {
            text: 'Entrada',
            fill: '#000',
            fontSize: 16,
            refX: '50%',
            refY: '70%',
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'topEntrada' || port.group == 'bottom'),
    },
});

X6.Shape.Polygon.define({
    shape: 'decisao',
    width: 150,
    height: 100,
    points: '75,0 150,75 75,150 0,75',
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
        },
        label: {
            text: 'Decisão',
            fill: '#000',
            fontSize: 16,
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'top' || port.group == 'falso' || port.group == 'verdadeiro'),
    },
});

X6.Shape.Ellipse.define({
    shape: 'conector',
    width: 75,
    height: 75,
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
        },
        label: {
            text: 'Conector',
            fill: '#000',
            fontSize: 16,
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'bottom' || port.group == 'left' || port.group == 'right'),
    },
});

X6.Shape.Path.define({
    shape: 'saida',
    width: 150,
    height: 80,
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
            d: 'M 0 40 L 30 0 L 120 0 A 30 30 90 0  1 120 80 L 30 80 Z',
        },
        label: {
            text: 'Saida',
            fill: '#000',
            fontSize: 16,
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'top' || port.group == 'bottom'),
    },
});

X6.Shape.Rect.define({
    shape: 'terminalInicio',
    width: 150,
    height: 70,
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
            rx: 60,
            ry: 60,
        },
        label: {
            text: 'Início',
            fill: '#000',
            fontSize: 16,
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'bottom'),
    },
});

X6.Shape.Rect.define({
    shape: 'terminalFinal',
    width: 150,
    height: 70,
    attrs: {
        body: {
            fill: '#34C4A0',
            stroke: '#000',
            rx: 60,
            ry: 60,
        },
        label: {
            text: 'Fim',
            fill: '#000',
            fontSize: 16,
        },
    },
    ports: {
        groups: ports.groups,
        items: ports.items.filter(port => port.group == 'top'),
    },
});

graph.addNode({
    id: 'terminalInicio',
    shape: 'terminalInicio',
    x: 300,
    y: 50,
});

graph.addNode({
    id: 'terminalFinal',
    shape: 'terminalFinal',
    x: 300,
    y: 550,
});

graph.on('node:dblclick', (e) => instanciarJanelaTexto(e.node))

/*Termino das configurações do framework*/

/*Blocos de inicio*/
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

let blocoConector = document.getElementById("BlcConector");
let cxConec = blocoConector.getContext("2d");

cxConec.fillStyle = "rgb(52, 196, 160)";
cxConec.beginPath();
cxConec.arc(110, 55, 30, 0, 2 * Math.PI);
cxConec.fill();
cxConec.closePath();

let blocoSaida = document.getElementById("BlcSaida");
let cxSaida = blocoSaida.getContext("2d");

cxSaida.fillStyle = "rgb(52, 196, 160)";
cxSaida.beginPath();
cxSaida.moveTo(0, 55);
cxSaida.lineTo(30, 0);
cxSaida.lineTo(190, 0);
cxSaida.arc(190, 55, 55, -Math.PI / 2, Math.PI / 2);
cxSaida.lineTo(30, 110);
cxSaida.fill();
cxSaida.closePath();