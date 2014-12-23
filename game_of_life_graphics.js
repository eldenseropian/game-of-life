var user_grid = [];

/**
 * Add event handlers to the control buttons.
 * @param {game_of_life} game The game_of_life instance that runs the game.
 */
function add_controls(game) {
    /**
     * Choose one of the example games. End the currently running game (if any)
     * and draw the new game.
     */
    $('#choose-game-of-life').click(function() {
        var selected_game = GAMES[
            $('#initial-state-chooser option:selected').index()
        ];
        var num_rows = selected_game.length;
        var num_cols = selected_game[0].length;
        make_grid(num_rows, num_cols);

        // copy the game so the example is not mutated
        user_grid = JSON.parse(JSON.stringify(selected_game));

        game.choose_game(user_grid, false);
    });

    /**
     * End the currently running game (if any) and start the new one.
     */
    $('#run-game-of-life').click(
        function() {
            game.end_game();
            game.choose_game(user_grid, true);
        }
    );

    /**
     * End the currently running game (if any).
     */
    $('#end-game-of-life').click(function() {
        game.end_game();
    });

    /**
     * If the user has entered valid grid dimensions, clear the grid and resize
     * it. Otherwise does nothing.
     */
    $('#resize-grid').submit(function() {
        var num_rows = $('#num-rows').val();
        var num_cols = $('#num-cols').val();
        if (!(num_rows === '' || num_rows < 0 ||
              num_cols === '' || num_cols < 0)) {
            make_grid(num_rows, num_cols);
        }
        return false;
    });

    $('#speed').on('change', function() {
        TIME_STEP = $('#speed').val();
    });
}

var GRID_SIZE = 400;

/**
 * Parse the state of the game from the display. Mutates user_grid.
 */
function reset_user_grid_to_display() {
    $('td').each(function() {
            var id = $(this).attr('id');
            var i = id.substring(0, id.indexOf('_'));
            var j = id.substring(id.indexOf('_') + 1);
            user_grid[i][j] = $(this).hasClass('alive');
    });
}

/**
 * Reset the grid to an empty grid with a fixed size.
 * @param  {number} num_rows The number of rows in the grid (positive integer).
 * @param  {number} num_cols The number of columns in the grid (positive interger).
 */
function make_grid(num_rows, num_cols) {
    $('#game-table').remove();

    $("#canvas-container").append(
        '<table border id="game-table"><tbody id="grid"></tbody></table>');

    for (var i = 0; i < num_rows; i++) {
        $('#grid').append('<tr></tr>');
    }

    $('tr').each(function(i, elt) {
        for (var j = 0; j < num_cols; j++) {
            $(elt).append('<td id="' + i + '_' + j + '"></td>');
        }
    });

    // Toggle whether a cell is alive by clicking on it.
    $('td').click(function() {
        $(this).toggleClass('alive');
        var id = $(this).attr('id');
        var i = id.substring(0, id.indexOf('_'));
        var j = id.substring(id.indexOf('_') + 1);
        user_grid[i][j] = $(this).hasClass('alive');
    });

    var cell_size = Math.min(GRID_SIZE / num_cols, GRID_SIZE / num_rows);
    $('#game-table').css('width', cell_size * num_cols);
    $('#game-table').css('height', cell_size * num_rows);

    user_grid = [];
    for (var i = 0; i < num_rows; i++) {
        user_grid.push([]);
        for (var j = 0; j < num_cols; j++) {
            user_grid[i].push(false);
        }
    }
};

/**
 * Draws the state of the game using the graphics.js library.
 * @param  {Grid} grid The state of the game to draw. Dimensions must match
 *     parameters to game_of_life.
 */
function draw(grid) {
    var num_rows = grid.length;
    var num_cols = grid[0].length;
    for (var i = 0; i < num_rows; i++) {
        for (var j = 0; j < num_cols; j++) {
            if (grid[i][j] === true) {
                $('#' + i + '_' + j).addClass('alive');
            } else if (grid[i][j] === false) {
                $('#' + i + '_' + j).removeClass('alive');
            } else {
                throw new Error('Unexpected grid value: ' + grid[i][j] +
                    ' at [' + i + '][' + j + '].');
            }
        }
    }
};