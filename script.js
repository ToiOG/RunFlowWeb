/*Ações que ocorrem decorrente a alguma ação do usuario*/
function instanciar(target, xBlocoInit, yBlocoInit) {
  let idBloco = target.id;
  switch (idBloco) {
    case "ProcessamentoInit":
      graph.addNode({
        shape: 'processamento',
        x: xBlocoInit,
        y: yBlocoInit,
      });
      break;
    case "EntradaInit":
      graph.addNode({
        shape: 'entrada',
        x: xBlocoInit,
        y: yBlocoInit,
      });
      break;
    case "DecisaoInit":
      graph.addNode({
        shape: 'decisao',
        x: xBlocoInit,
        y: yBlocoInit,
      });
      break;
    case "SaidaInit":
      graph.addNode({
        shape: 'saida',
        x: xBlocoInit,
        y: yBlocoInit,
      });
      break;
  }
}

function instanciarJanelaTexto(e) {
  const body = document.querySelector("body");

  let janela = document.createElement("div");
  janela.id = "janelaTexto";

  let textoJanela = document.createElement("label");
  textoJanela.id = "textoJanela";
  textoJanela.textContent = "Insira o conteúdo do bloco no campo abaixo:";

  let campoTexto = document.createElement("input");
  campoTexto.id = "campoTexto";
  campoTexto.value = e.attr('label/text');
  campoTexto.type = "text";

  let divBtn = document.createElement("div");
  divBtn.id = "divBtn";

  let btnSalvar = document.createElement("button");
  btnSalvar.id = "btnSalvar";
  btnSalvar.innerHTML = "Salvar";
  btnSalvar.addEventListener('click', () => modificarTexto(e));

  let btnCancelar = document.createElement("button");
  btnCancelar.id = "btnCancelar";
  btnCancelar.innerHTML = "Cancelar";
  btnCancelar.addEventListener('click', () => fecharJanela("janelaTexto"));

  divBtn.appendChild(btnCancelar);
  divBtn.appendChild(btnSalvar);
  janela.appendChild(textoJanela);
  janela.appendChild(campoTexto);
  janela.appendChild(divBtn);
  body.appendChild(janela);
}

function modificarTexto(node) {
  node.attr('label/text', document.getElementById("campoTexto").value);
  fecharJanela("janelaTexto");
}

function fecharJanela(idJanela) {
  let janela = document.getElementById(idJanela);
  janela.parentElement.removeChild(janela);
}
