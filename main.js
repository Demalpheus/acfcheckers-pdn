const gameStartFEN = '[FEN "B:W21,22,23,24,25,26,27,28,29,30,31,32:B1,2,3,4,5,6,7,8,9,10,11,12"]'

class FENComponent extends HTMLElement {
    connectedCallback() {
        let fen = this.getAttribute('data-fen')
        // Clear contents
        this.innerText = ""
        // Create controls
        let leftspacer = document.createElement('div')
        leftspacer.classList.add("pdn-spacer")
        leftspacer.innerText = ""
        let rightspacer = document.createElement('div')
        rightspacer.classList.add("pdn-spacer")
        let flipbutton = document.createElement('button')
        flipbutton.classList.add("pdn-flip")
        flipbutton.innerText = "flip"
        flipbutton.onclick = function (event) { reverseBoard((event.target.parentElement).parentElement) }
        rightspacer.appendChild(flipbutton)
        let title = document.createElement('div')
        let turntext = getFenTurnText(fen)
        title.classList.add("pdn-title")
        title.innerText = turntext

        let board = document.createElement('div')
        board.classList.add('board')
        this.appendChild(leftspacer)
        this.appendChild(title)
        this.appendChild(rightspacer)
        this.appendChild(board)

        initBoard(board, fen);
    }
}

customElements.define('pdn-fen', FENComponent)


class PDNComponent extends HTMLElement {
    connectedCallback() {
        // Grab PDN information
        let fen = this.getAttribute('data-fen')
        let player1 = this.getAttribute('data-player1')
        let player2 = this.getAttribute('data-player2')
        let moves = this.getAttribute('data-moves')
        
        // Clear contents
        this.innerText = ""
        let leftspacer = document.createElement('div')
        leftspacer.classList.add('pdn-spacer')
        leftspacer.innerText = ''
        let rightspacer = document.createElement('div')
        rightspacer.classList.add('pdn-spacer')
        let flipbutton = document.createElement('button')
        flipbutton.classList.add('pdn-flip')
        flipbutton.innerText = 'flip'
        flipbutton.onclick = function (event) { reverseBoard((event.target.parentElement).parentElement) }
        rightspacer.appendChild(flipbutton)
        let title = document.createElement('div')
        title.innerText = 'Game Title Placeholder'
        title.classList.add('pdn-title')
        let board = document.createElement('div')
        board.classList.add('board')
        
        this.appendChild(leftspacer)
        this.appendChild(title)
        this.appendChild(rightspacer)
        this.appendChild(board)

        if (fen == '' || fen === null) {
            fen = gameStartFEN
        }

        initBoard(board, fen);
    }
}

customElements.define('pdn-game', PDNComponent)

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


function initBoard(board, fen) {
    //let fen = board.getAttribute('data-fen');
    board.textContent = '';
    //let turntext = getFenTurnText(fen)

    // Add Title
    //let toplay = document.createElement("div")
    //toplay.innerText = turntext
    // Need to convert pdn generation to a child of pdn-fen node to allow additional items
    // for title, notation, controls, etc.
    //document.appendChild(toplay)

    // Add number overlay
    for (let i = 1; i < 33; i++) {
        let n = document.createElement("div");
        n.innerText = i
        n.classList.add(`number-overlay-${i}`)
        board.appendChild(n);
    }
    if (fen == "") {
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
    } else {
        let pos = setPosition(fen);
        for (let i=0; i < 32; i++) {
            if (pos[i] != "") {
                let s = document.createElement("div");
                s.classList.add("piece", pos[i], `square-${i+1}`);
                board.appendChild(s);
            }
        }
    }
}

function setPosition(fen) {
    // Interprets a FEN string to return the desired position
    // Example FEN 
    // [FEN "B:W18,24,27,28,K10,K15:B12,16,20,K22,K25,K29"]
    let turn = fen.split(':')[0].replace("FEN", "").replace("[","").replace(" ","").replace('"',"")
    //console.log('current Turn: ' + turn)
    let redString = fen.split(":")[2].replace("B","").replace('"',"").replace("]","").split(",")
    let whiteString = fen.split(":")[1].replace("W","").replace('"',"").replace("]","").split(",")
    //console.log('Red squares: ' + redString)
    //console.log('White squares: ' + whiteString)
    let position = []
    for (let index = 0; index < 32; index++) {
       position.push("") 
    }
    redString.forEach(element => {
        if (element.indexOf("K") > -1) {
            let p = element.replace("K","")
            position[p-1] = "rk"
        } else {
            position[element-1] = "rp"
        }
    })
    whiteString.forEach(element => { 
        if (element.search("K") > -1) {
            let p = element.replace("K", "")
            position[p-1] = "wk"
        } else {
            position[element-1] = "wp"
        }
    })
    //console.log('New Position:')
    //console.log(position)
    return position
}

function getFenTurnText(fen) {
    let turn = fen.split(':')[0]
    let turntext = ""
    if ( turn.substring(turn.length -1) == "B") {
        turntext = "Red to play"
    } else if (turn.substring(turn.length - 1) == "W") {
        turntext = "White to play"
    }
    return turntext
}

function findInvertSquare(number) {
    if (number < 17) {
        number = 32 - (number - 1)
    } else {
        number = 33 - number
    }
    return number
}

function reverseBoard(board) {
    let squares = board.querySelectorAll(".piece");
    squares.forEach(element => {
        let c = element.classList
        c.forEach(m => {
            if (m.match(/square.*/)) {
                let n = Number(m.split('-')[1])
                let rn = findInvertSquare(n)
                element.classList.remove(m)
                element.classList.add(`square-${rn}`)
            }
        })
    })
    let overlays = board.querySelectorAll('[class*="number-overlay"]')
    console.log('overlays found: ' + overlays.length)
    overlays.forEach(o => {
        let n = Number(o.innerText)
        let rn = findInvertSquare(n)
        o.innerText = rn
    })
}
