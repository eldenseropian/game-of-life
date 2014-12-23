/**
 * The state of an instance of Conway's game of life, represented by a grid of
 * booleans. True entries indicate live cells; false entries are dead ones.
 * @typedef {Array.<Array.<boolean>>} Grid
 */

/**
 * Contains methods for running Conway's Game Of Life. Operates on an
 *     immutable grid representation of the board state.
 */
function game_of_life() {
    this.running = false;
    this.stop = false;
    this.game = [[false]];

    /**
     * Start the current game running.
     */
    this.start_game = function() {
        this.running = true;
        this.run(this.game);
    }

    /**
     * End the current game and update the client's copy of the state.
     */
    this.end_game = function() {
        if (this.running === true) {
            this.callback = function() {};
            this.stop = true;
        }
        reset_user_grid_to_display();
    }

    /**
     * Choose and run an example Game.
     * @param {Grid} new_game The grid representing the initial state of the
     *     game.
     * @param {boolean} start_after_choosing Whether the game should immediately
     *     start.
     */
    this.choose_game = function(new_game, start_after_choosing) {
        var self = this;

        var choose_new_game = function() {
            self.game = new_game;
            draw(self.game);
            
            self.callback = function() {};

            if (start_after_choosing) {
                self.start_game();
            }
        }

        if (self.running === true) {
            // If there is a game currently running, this will be called
            // once it terminates
            self.callback = function() {
                self.running = false;
                self.stop = false;
                choose_new_game();
            }
            // send the signal to terminate the current game
            self.stop = true;
        } else {
            choose_new_game();
        }
    }

    /**
     * Count the number of alive neighbors of a cell.
     * @param  {Grid} grid The game state.
     * @param  {number} i The row of the cell.
     * @param  {number} j The column of the cell.
     * @return {number} The number of live neighbors of grid[i][j].
     */
    this.count_num_alive_neighbors = function(grid, i, j) {
        var num_rows = grid.length;
        var num_cols = grid[0].length;

        var valid_row_indices = [i];
        if (i - 1 >= 0) {
            valid_row_indices.push(i - 1);
        }
        if (i + 1 < num_rows) {
            valid_row_indices.push(i + 1);
        }

        var valid_col_indices = [j];
        if (j - 1 >= 0) {
            valid_col_indices.push(j - 1);
        }
        if (j + 1 < num_cols) {
            valid_col_indices.push(j + 1);
        }

        var num_alive_neighbors = 0;
        for (var k = 0; k < valid_row_indices.length; k++) {
            for (var l = 0; l < valid_col_indices.length; l++) {
                var row = valid_row_indices[k];
                var col = valid_col_indices[l];
                if (!(row === i && col === j)) {
                    num_alive_neighbors += grid[row][col];
                }
            }
        }
        return num_alive_neighbors;
    }

    /**
     * Complete one step of the Game Of Life.
     * @param {Grid} grid The state of the game to step. Dimensions must match
     *     parameters to game_of_life.
     * @return {Grid} The state of the game after the step is completed.
     */
    this.step = function(grid) {
        var num_rows = grid.length;
        var num_cols = grid[0].length;

        var stepped_grid = [];
        for (var i = 0; i < num_rows; i++) {
            stepped_grid.push([]);
            for (var j = 0; j < num_cols; j++) {
                if (grid[i][j] === true) {
                    var num_alive_neighbors = this.count_num_alive_neighbors(
                        grid, i, j);
                    if (num_alive_neighbors === 2 ||
                        num_alive_neighbors === 3) {
                        // survival
                        stepped_grid[i].push(true);
                    } else {
                        // death by overcrowding or isolation
                        stepped_grid[i].push(false);
                    }
                } else {
                    if (this.count_num_alive_neighbors(grid, i, j) === 3) {
                        // birth
                        stepped_grid[i].push(true);
                    } else {
                        // no birth
                        stepped_grid[i].push(false);
                    }
                }
            }
        }
        return stepped_grid;
    };

    /**
     * Runs Conway's Game Of Life. Continuously steps the game. Draws the grid
     *     after each step has been completed. Pauses between steps to make
     *     the progress visible. Loops forever, unless the game converges, in
     *     which case it returns the final game state.
     * @param {Grid} init_grid The initial state of the game. Dimensions must
     *     match parameters to game_of_life.
     * @return {Grid} The converged state of the game, if any.
     */
    this.run = function(init_grid) {
        draw(init_grid);

        var self = this;
        window.setTimeout(function() {
            var final_grid = self.step(init_grid);
            if (_.isEqual(final_grid, init_grid) || self.stop === true) {
                self.stop = false;
                self.running = false;
                self.callback();
            } else {
                self.run(final_grid);
            }
        }, TIME_STEP);
    }
}