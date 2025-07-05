let ScrabbleTiles = {};
let tileBag = [];
let currentWord = "";
let totalScore = 0;

async function loadTiles() {
    const response = await fetch('pieces.json');
    const data = await response.json();
    data.pieces.forEach(piece => {
        ScrabbleTiles[piece.letter] = {
            value: piece.value,
            original: piece.amount
        };

        for (let i = 0; i < piece.amount; i++) {
            tileBag.push(piece.letter);
        }
    });
    drawTiles(7);
    buildBoard();
}

function drawTiles(n) {
    const rack = $('#rack').empty();
    for (let i = 0; i < n; i++) {
        const index = Math.floor(Math.random() * tileBag.length);
        const letter = tileBag.splice(index, 1)[0];
        const tile = $('<img>')
            .addClass('tile')
            .attr('src', `Scrabble_Tiles/Scrabble_Tile_${letter}.jpg`)
            .attr('data-letter', letter);
        tile.draggable({
            revert: "invalid"
        });
        rack.append(tile);
    }
}

function buildBoard() {
    const board = $('#board').empty();
    const types = [null, "double-letter", null, "triple-letter", null, "double-word", null];
    for (let i = 0; i < 7; i++) {
        const slot = $('<div class="drop-slot"></div>').addClass(types[i] || "").data('type', types[i]);
        slot.droppable({
            accept: ".tile",
            drop: function(event, ui) {
                const tile = ui.draggable;
                const letter = tile.data('letter');
                const value = ScrabbleTiles[letter].value;
                let score = value;
                switch ($(this).data('type')) {
                    case 'double-letter':
                        score *= 2;
                        break;
                    case 'triple-letter':
                        score *= 3;
                        break;
                }
                tile.position({
                    of: $(this),
                    my: "left top",
                    at: "left top"

                });
                tile.draggable("disable");
                tile.css({
                    position: "absolute"

                });
                $(this).append(tile);
                currentWord += letter;
                totalScore += score;
                $('#current-word').text(currentWord);
                $('#score').text(totalScore);
            }
        });
        board.append(slot);
    }
}

$('#submit').click(() => {
    alert(`Word Submitted: ${currentWord}\nScore: ${totalScore}`);
    $('#rack').empty();
    drawTiles(7);
    buildBoard();
    currentWord = "";
    totalScore = 0;
    $('#current-word').text("");
    $('#score').text("0");
});

$('#reset').click(() => {
    tileBag = [];
    currentWord = "";
    totalScore = 0;
    $('#current-word').text("");
    $('#score').text("0");
    loadTiles();
});

$(document).ready(() => {
    loadTiles();
});