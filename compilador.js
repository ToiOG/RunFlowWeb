let blocoDecisao = false;
function getProximoNode(node) {
    const edges = graph.getConnectedEdges(node);
    const saidas = edges.filter(edge => edge.getSourceCellId() === node.id).map(edge => graph.getCellById(edge.getTargetCellId()));
    return saidas[0] || null;
}

function processarDecisao(node, linhas) {
    const condicao = node.attr("label/text");
    const edges = graph.getConnectedEdges(node);
    let proximoTrue = null;
    let proximoFalse = null;
    edges.forEach(edge => {
        const portId = edge.getSourcePortId();
        const port = node.getPort(portId);
        const group = port?.group;
        const target = graph.getCellById(edge.getTargetCellId());
        if (group === "verdadeiro") {
            proximoTrue = target;
        }
        if (group === "falso") {
            proximoFalse = target;
        }
    });
    linhas.push(`if ${condicao}`);
    executarNode(proximoTrue, linhas);
    linhas.push("else");
    executarNode(proximoFalse, linhas);
    linhas.push("end");
    blocoDecisao = true;
}

function executarNode(node, codigoSeparado) {
    if (node.id != "terminalInicio") {
        let codigoNode = node.attr('label/text') || "";
        let tipoNode = node.shape;

        switch (tipoNode) {
            case "processamento": {
                codigoSeparado.push(`set ${codigoNode}`)
            }
                break;

            case "entrada": {
                codigoSeparado.push(`input ${codigoNode}`)
            }
                break;

            case "saida": {
                let cont = 0;
                let frasePrint = separarVariaveisPrint(codigoNode, cont);
                codigoSeparado.push(`print ${frasePrint}`)
            }
                break;
            case "decisao": {
                processarDecisao(node, codigoSeparado);
            }
                break;
            case "conector": {
                codigoSeparado.push(`conector`)
            }
                break;
        }
    }
    let proximoNode;
    if (blocoDecisao == false) {
        proximoNode = getProximoNode(node);
    } else {
        proximoNode = getProximoNode(node);
        proximoNode = getProximoNode(proximoNode);
        blocoDecisao = false;
    }
    if (proximoNode.id != "terminalFinal") {
        executarNode(proximoNode, codigoSeparado)
    }
}

function gerarPseudocodigo(nodeInicial) {
    let nodeAtual = nodeInicial;
    let codigoSeparado = [];
    executarNode(nodeAtual, codigoSeparado);
    return codigoSeparado.join("\n");
}

function comecarFluxograma() {
    let pseudoCodigo = gerarPseudocodigo(graph.getCellById('terminalInicio'));
    runScript(pseudoCodigo);
}

function separarVariaveisPrint(frase) {

    const partes = frase.split("+");
    let resultado = "";

    for (let i = 0; i < partes.length; i++) {
        const parte = partes[i];
        if (!parte) continue;
        if (parte.includes("'") || parte.includes('"')) {
            resultado += parte.replace(/["'"|'"']/g, "");
        } else {
            resultado += `{${parte.trim()}}`;
        }
    }
    return resultado;
}