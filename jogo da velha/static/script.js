const usuario = sessionStorage.getItem('usuarioLogado');
if (!usuario) { window.location.href = "/login"; }

document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const gameModeSelect = document.getElementById('gameMode');
    const judgeMsg = document.getElementById('judge-message');
    const boardArr = ["", "", "", "", "", "", "", "", ""];
    let gameActive = true;
    let turn = "X";

    if(document.getElementById('playerName')) {
        document.getElementById('playerName').innerText = usuario;
    }

    // FUNÇÃO DO JUIZ
    function juizFala(msg) {
        if (judgeMsg) judgeMsg.innerText = msg;
    }

    // TEMA
    document.getElementById('themeBtn').onclick = () => document.body.classList.toggle('light-theme');

    // CLIQUES
    cells.forEach(cell => {
        cell.onclick = (e) => {
            const i = e.target.dataset.index;
            if (boardArr[i] !== "" || !gameActive) return;

            makeMove(i, "X");
            juizFala("Boa jogada, " + usuario + "! Estou de olho...");

            if (gameActive && gameModeSelect.value !== "friend") {
                juizFala("O Robô está calculando...");
                setTimeout(robotMove, 600);
            } else if (gameActive) {
                turn = turn === "X" ? "O" : "X";
                statusText.innerText = `Vez de: ${turn}`;
            }
        };
    });

    function makeMove(i, p) {
        boardArr[i] = p;
        cells[i].innerText = p;
        cells[i].classList.add(p.toLowerCase());
        checkGameStatus(p);
    }

    function robotMove() {
        if (!gameActive) return;
        let move;
        const level = gameModeSelect.value;

        if (level === "hard") move = getBestMove();
        else if (level === "medium") move = Math.random() > 0.5 ? getBestMove() : getRandomMove();
        else move = getRandomMove();

        if (move !== null) {
            makeMove(move, "O");
            if (gameActive) juizFala("O Robô contra-atacou! Sua vez.");
        }
    }

    function getRandomMove() {
        const avail = boardArr.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        return avail.length > 0 ? avail[Math.floor(Math.random() * avail.length)] : null;
    }

    function getBestMove() {
        for (let p of ["O", "X"]) { // Tenta ganhar, depois bloqueia
            const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
            for (let s of wins) {
                const [a, b, c] = s;
                if (boardArr[a] === p && boardArr[b] === p && boardArr[c] === "") return c;
                if (boardArr[a] === p && boardArr[c] === p && boardArr[b] === "") return b;
                if (boardArr[b] === p && boardArr[c] === p && boardArr[a] === "") return a;
            }
        }
        return getRandomMove();
    }

    function checkGameStatus(p) {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        const win = wins.some(s => s.every(i => boardArr[i] === p));
        
        if (win) {
            statusText.innerText = `Vencedor: ${p}`;
            gameActive = false;
            juizFala(p === "X" ? "TEMOS UM CAMPEÃO! Parabéns " + usuario : "O Robô venceu! Mais sorte na próxima.");
        } else if (!boardArr.includes("")) {
            statusText.innerText = "Empate!";
            gameActive = false;
            juizFala("Empate! Que partida equilibrada!");
        }
    }

    document.getElementById('resetBtn').onclick = () => location.reload();
});

function sair() { sessionStorage.removeItem('usuarioLogado'); window.location.href = "/login"; }