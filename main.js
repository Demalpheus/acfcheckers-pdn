function move(start, end) {
    try {
        let piece = document.querySelector(`.square-${start}`);
        // Determine the order in which to change css classes
        if (Number(start) > Number(end)) {
            piece.classList.add(`square-${end}`);
            piece.classList.remove(`square-${start}`);
        } else {
            piece.classList.remove(`square-${start}`);
            piece.classList.add(`square-${end}`);
        }
    } catch (err) {
        console.log('No piece to move');
    }
}

function removePiece(square) {
    let s = document.querySelector(`.square-${square}`);
    if (s.classList.contains("wp")) {
        s.classList.remove("wp");
    } else if (s.classList.contains("wk")) {
        s.classList.remove("wk");
    } else if (s.classList.contains("rp")) {
        s.classList.remove("rp");
    } else if (s.classList.contains("rk")) {
        s.classList.remove("rk");
    }
}

function initBoard(boardId, FEN) {
    let board = document.getElementById(boardId);
    // Clear board childen
    board.textContent = '';
    if (FEN === undefined) {
        // Set red pieces
        for (let i=1; i < 13; i++) {
            let s = document.createElement("div");
            s.classList.add("piece", "rp", `square-${i}`);
            board.appendChild(s);
        }
        for (let i=21; i < 33; i++) {
            let s = document.createElement("div");
            s.classList.add("piece", "wp", `square-${i}`);
            board.appendChild(s);
        }
    }
}
