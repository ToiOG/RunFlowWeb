const consoleEl = document.getElementById("console");
const cmdEl = document.getElementById("cmd");
const btnRun = document.getElementById("btnRun");
const btnStop = document.getElementById("btnStop");
const btnClear = document.getElementById("btnClear");

let running = false;
let stopRequested = false;

function ts() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${hh}:${mm}:${ss}`;
}

function logLine(text, type = "muted") {
    const line = document.createElement("div");
    line.className = `line ${type}`;
    line.innerHTML = `<span class="ts">${ts()}</span>${escapeHtml(text)}`;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function clearConsole() {
    consoleEl.innerHTML = "";
}

function sleep(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function setRunning(state) {
    running = state;
    btnRun.disabled = state;
    btnStop.disabled = !state;
    cmdEl.disabled = false; // deixa comandos ok
}

function tokenize(line) {
    // aceita: print "texto com espaços" | wait 300 | error "msg" | input varname
    const trimmed = line.trim();
    if (!trimmed) return null;

    // string entre aspas
    const matchQuoted = trimmed.match(/^(\w+)\s+"([\s\S]*)"$/);
    if (matchQuoted) return { op: matchQuoted[1].toLowerCase(), arg: matchQuoted[2] };

    const parts = trimmed.split(/\s+/);
    return { op: parts[0].toLowerCase(), arg: parts.slice(1).join(" ") };
}

async function runScript(text) {
    if (running) return;

    stopRequested = false;
    setRunning(true);

    const vars = Object.create(null);
    const lines = text.split(/\r?\n/);

    logLine("Iniciando execução...", "info");

    for (let i = 0; i < lines.length; i++) {
        if (stopRequested) {
            logLine("Execução interrompida.", "warn");
            setRunning(false);
            return;
        }

        const raw = lines[i];
        const t = tokenize(raw);
        if (!t) continue;

        // Mostra "linha atual" como se fosse compilador/runner
        logLine(`L${i + 1}: ${raw}`, "muted");
        await sleep(120); // efeito visual de "tempo real"

        try {
            if (t.op === "print") {
                // substitui {variavel} no texto
                const rendered = t.arg.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ""));
                logLine(rendered, "ok");
            } else if (t.op === "wait") {
                const ms = Number(t.arg);
                if (!Number.isFinite(ms) || ms < 0) throw new Error("wait precisa de um número (ms).");
                await sleep(ms);
            } else if (t.op === "error") {
                throw new Error(t.arg || "Erro simulado.");
            } else if (t.op === "input") {
                const name = (t.arg || "").trim();
                if (!name) throw new Error("input precisa do nome da variável. Ex: input nome");
                const val = prompt(`Digite um valor para ${name}:`) ?? "";
                const num = Number(val);
                vars[name] = Number.isNaN(num) ? val : num;
                logLine(`(input) ${name} = "${val}"`, "info");
            } else if (t.op === "set") {
                // extra: set var valor
                // ex: set idade 20
                let exprCompleta = (t.arg || "").trim();
                const partes = exprCompleta.split("=");
                if (partes.length !== 2) {
                    throw new Error("Formato inválido. Use: set VAR = expressão");
                }
                const k = partes[0].trim();
                const expr = partes[1].trim();
                const valor = realizarEquacao(expr, vars);
                vars[k] = valor;
                logLine(`(set) ${k} = ${valor}`, "info");
            } else if (t.op === "if") {
                const condicao = t.arg;
                const resultado = realizarEquacao(condicao, vars);
                if (!resultado) {
                    while (i < lines.length) {
                        i++;
                        const linha = lines[i]?.trim();
                        if (linha?.startsWith("else")) {
                            break;
                        }
                        if (linha?.startsWith("end")) {
                            break;
                        }
                        if (linha?.startsWith("conector")) {
                            break;
                        }
                    }
                }
            } else if (t.op === "else") {
                while (i < lines.length) {
                    i++;
                    const linha = lines[i]?.trim();
                    if (linha?.startsWith("end")) {
                        break;
                    }
                    if (linha?.startsWith("conector")) {
                        break;
                    }
                }
            } else if (t.op === "end") {
                while (i < lines.length) {
                    i++;
                    const linha = lines[i]?.trim();
                    if (linha?.startsWith("conector")) {
                        break;
                    }
                }
            } else if (t.op === "conector") {

            }
            else {
                logLine(`Comando desconhecido: ${t.op}`, "warn");
            }
        } catch (e) {
            logLine(`Erro na linha ${i + 1}: ${e.message}`, "err");
            setRunning(false);
            return;
        }
    }

    logLine("Execução finalizada com sucesso.", "info");
    setRunning(false);
}

function handleCommand(cmd) {
    const c = cmd.trim().toLowerCase();
    if (!c) return;

    logLine(`> ${cmd}`, "info");

    if (c === "help") {
        logLine("Comandos: help | run | clear | stop", "muted");
        logLine('Script: print "texto" | wait 300 | input nome | error "msg" | set x 10', "muted");
    } else if (c === "clear") {
        clearConsole();
    } else if (c === "run") {
        runScript(scriptEl.value);
    } else if (c === "stop") {
        stopRequested = true;
    } else {
        logLine(`Comando não reconhecido: ${cmd}`, "warn");
    }
}

// UI events
btnRun.addEventListener("click", () => comecarFluxograma());
btnStop.addEventListener("click", () => stopRequested = true);
btnClear.addEventListener("click", clearConsole);

cmdEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const v = cmdEl.value;
        cmdEl.value = "";
        handleCommand(v);
    }
});

function realizarEquacao(expr, vars) {
    const resolvida = expr.replace(/\b[a-zA-Z_]\w*\b/g, (nome) => {
        if (vars[nome] !== undefined) {
            return vars[nome];
        }
        return nome;
    });
    return Function(`return ${resolvida}`)();
}
