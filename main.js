function move(start, end) {
    try {
        let piece = document.querySelector(`.square-${start}`);
        piece.classList.remove(`square-${start}`);
        piece.classList.add(`square-${end}`);

    } catch (err) {
        console.log('No piece to move');
    }
}
