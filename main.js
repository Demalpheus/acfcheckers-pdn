class FENComponent extends HTMLElement {
    connectedCallback() {
        let fen = this.getAttribute('data-fen')
        // Clear contents
        this.innerText = ""
        // Create controls
        let title = document.createElement('div')
        let turntext = getFenTurnText(fen)
        title.classList.add("pdn-title")
        title.innerText = turntext

        let board = document.createElement('div')
        board.classList.add('board')
        this.appendChild(title)
        this.appendChild(board)

        let reversebtn = document.createElement('button')
        reversebtn.innerText = "reverse me"
        reversebtn.onclick = function (event) { reverseBoard(event.target.parentElement) }
        this.appendChild(reversebtn)
        // Check to see if the data-reverse-board value is set, else use a default value of true
/*        let reversedAttr = this.getAttribute('data-reverse-board')
        let reversed = true
        if (reversedAttr == "false") {
            reversed = false
        } 
        let numbersAttr = this.getAttribute('data-show-numbers')
        let showNumbers = true
        if (numbersAttr == "false") {
            showNumbers = false
        }
        let newBoard = document.createElement('canvas')
        let size = getBoardSize()
        newBoard.width = size
        newBoard.height = size
        this.appendChild(newBoard)
        let context = newBoard.getContext("2d")
        drawBoard(newBoard.width, newBoard.height, reversed, showNumbers, context)
        let coordinates = getPiecePlacements(newBoard)
        let position = setPosition(fen)
        //console.log('NEW POSITION RETURNED: ' + position)
        drawPosition(position, coordinates, newBoard.width, reversed, context)
*/
        initBoard(board, fen);
    }
}

customElements.define('pdn-fen', FENComponent)

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
