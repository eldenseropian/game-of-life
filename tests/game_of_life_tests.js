/**
 * Because of the UI nature of this project, several parts of game_of_life
 * must be manually tested; most significantly, the draw function. This file
 * will test the step function, to check that the game state is mutated
 * correctly, and the run function, to check that the game terminates
 * appropriately for games that converge.
 */

/**
 * Return a deep copy of an array. Only works for objects that can be converted
 *     to and from strings via JSON.
 * @param  {Array.<E>} array The array to copy.
 * @return {Array.<E>} A deep copy of array.
 */
var copy_array = function(array) {
    return JSON.parse(JSON.stringify(array));
}

/**
 * Test that the step function returns the correct end state and does not
 *     mutate the input state.
 * @param  {Grid} init_state The state to step.
 * @param  {Grid} expected_final_state The expected state after the step.
 */
var test_step = function(init_state, expected_final_state) {
    var init_state_copy = copy_array(init_state);
    var game = new game_of_life();
    var actual_final_state = game.step(init_state);

    equal(_.isEqual(expected_final_state, actual_final_state), true,
        "State after step is correct.");

    equal(_.isEqual(init_state, init_state_copy), true,
        "Initial state is not mutated.");
}

test("step_still_life", function() {
    var initial_state = string_to_boolean(
        '----\n' +
        '-@@-\n' +
        '-@@-\n' +
        '----'
    );
    var expected_final_state = copy_array(initial_state);
    test_step(initial_state, expected_final_state);
});

test("step_oscillator", function() {
    var initial_state = string_to_boolean(
        '-----\n' +
        '-----\n' +
        '-@@@-\n' +
        '-----\n' +
        '-----'
    );
    var expected_final_state = string_to_boolean(
        '-----\n' +
        '--@--\n' +
        '--@--\n' +
        '--@--\n' +
        '-----'
    );
    test_step(initial_state, expected_final_state);
});

test("step_glider", function() {
    var states = [
        string_to_boolean(
            '-----\n' +
            '--@--\n' +
            '---@-\n' +
            '-@@@-\n' +
            '-----'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '-@-@-\n' +
            '--@@-\n' +
            '--@--'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '---@-\n' +
            '-@-@-\n' +
            '--@@-'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '--@--\n' +
            '---@@\n' +
            '--@@-'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '---@-\n' +
            '----@\n' +
            '--@@@'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '-----\n' +
            '--@-@\n' +
            '---@@'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '-----\n' +
            '----@\n' +
            '---@@'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '-----\n' +
            '---@@\n' +
            '---@@'
        ),
        string_to_boolean(
            '-----\n' +
            '-----\n' +
            '-----\n' +
            '---@@\n' +
            '---@@'
        )
    ];
    for (var i = 0; i < states.length - 1; i++) {
        test_step(states[i], states[i + 1]);
    }
});

test("step_rectangular", function() {
    var initial_state = string_to_boolean(
        '--@--\n' +
        '-@-@-\n' +
        '-----'
    );
    var expected_final_state = string_to_boolean(
        '--@--\n' +
        '--@--\n' +
        '-----'
    );
    test_step(initial_state, expected_final_state);
});