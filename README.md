proj1
=====

# Game of Life: Design Document


## Running Directions

To run the example games, open game_of_life.html in your browser. Select an
initial state from the drop down menu, and click run. You can restart the
game or change the state at any time via the drop down and the run button.
Note that the first option - "Still Life" - is a game that does not change
from time step to time step. The rest do; some of them converge and will remain
on the final state until restarted, others oscillate forever.

## Grading Directions: Phase 2

#### Highlights
- I'm happy with how my code is split up: separate files for graphics, examples,
game logic, and tests.

### Help wanted:
- The way I really wanted to write this code would be to use angular to have one
object to hold my grid, and then render bind the table in the DOM to that
object. What I have instead is an object holding the grid and a separate represention
via the DOM's table. When the user updates the DOM table, the object must be
updated, and when the game is advanced, the DOM must be updated. I could make
this work by having everything on the DOM, but then there go my unit tests.
What would be a better way to approach this (without angular)?
- I'm proud of how easy it was to do the initial conversion from graphics to HTML. The diff is
[here](https://github.com/6170-fa14/seropian_proj1/commit/80c82d52ef7b56938c129d84b192989f8b400577),
and all it took was getting rid of the graphics code and some jQuery. it took
approximately 10 minutes.
- I'm proud of how pretty it is!

## Grading Directions: Phase 1

#### Highlights

- I am proud of the run-interrupt pattern I designed (described in this file
at **How do we interrupt a game in progress?**, implemented
[here](game_of_life.js#L17-54) and [here](game_of_life.js#L193-205).
I'm proud because it works, and because it makes use of
callbacks and first-class functions. I'm not proud because it's complicated,
and I'd like some feedback on a way to accomplish the same thing in a cleaner
manner.
- I am proud of how cleanly the state and view code are separated (described in
this file at **How can we best separate the game state from the view?**,
implemented [here](game_of_life.js#L140)). I wrote the tests and game code and
got it completely functional without any view, and writing the view did not
require me to modify the state code. I am confident that swapping the view to
pure HTML/CSS will not be terribly difficult.
- I am proud of my [Portal cake example](game_of_life.js#L278-L312). Portal is
awesome.

#### Help Wanted

- [Is there a better way to access 'this' from inner functions?](game_of_life.js#L18)
- [What is a cleaner pattern for determining which of the eight possible
neighbors are actually valid?](game_of_life.js#L63)
- [Is there a better way to do a deep copy of a JavaScript array?](tests/game_of_life_tests.js#L15)

## Design Challenges

##### What should the different initial states be?
According to [Wikipedia](http://en.wikipedia.org/wiki/Conway's_Game_of_Life),
there are three common classifications of patterns that regularly occur in Life:
still lifes, oscillators, and spaceships. Thus, the initial states should
provide, at minimum, an example of each of these patterns. It's also fun to
do an example that starts as something recognizable, and devolves into chaos,
like in the [example implementation](http://conwaysgameoflife.appspot.com/).
The starting states will therefore be:
* A collection of still lifes
* A collection of oscillators
* A collection of spaceships
* The text "6.170"
* The [cake icon]
(http://img.photobucket.com/albums/1003/Athenaia/Icons/portal-cake.jpg) from 
[Portal](http://www.valvesoftware.com/games/portal.html)

##### How can we provide different initial states?
Possible methods:
- Have state encoded in URL
    - Pros:
        - Allows for arbitrary start state for the adventurous user
    - Cons:
        - Requires URL parsing
        - Requires user to enter unwieldy URL
        - Requires ugly links to provide useful examples to user
        - Complexity of initial state limited by URL size restrictions which
          vary
        - Generating URLs for new states will be difficult because of
          difficulty representing complexity of game as a single string; may
          require writing code to generate a URL from a state
        - Requires server or client-side routing
- Use UI component to select state
    - Pros:
        - User-friendly
        - Easy to add more states
        - Entire application accessed through a single URL
    - Cons:
        - Requires UI components which belong in Phase 2
- Use URL to select state
    - Pros:
        - User-friendly
        - Easy to add more states
        - Allows for links to specific examples
    - Cons:
        - User must know available URLs
        - Requires server or client-side routing

Decision: The user will use a UI component to select the desired initial state.
Encoding the state in the URL is undesirable because of the hassle of
translating the state to and from string form and because of the inelegance of
the user experience. Using the URL to select the state introduces additional
complexity because it requires a server or client-side routing. Using a UI
component results in an elegant user experience.

##### How do we represent an infinite board on a finite screen?
Possible options:
- Every square outside the screen is dead
    - Pros:
        - Simple to implement
    - Cons:
        - May result in Life dying out
- Every square outside the screen is alive
    - Pros:
        - Simple to implement
    - Cons:
        - Will constantly birth new cells 
- Sides of grid "wrap around" - top is connected to the bottom, left is
  connected to the right
    - Pros:
        - Feels like a more correct interpretation of an infinite space given
          our constraints
    - Cons:
        - More complex to implement; requires logic around borders
        - May look confusing to the user watching the Game
- Grid automatically zooms out as necessary
    - Pros:
        - Most accurate visualization of the infinite nature of the board
    - Cons:
        - Will zoom out to the point that individual cells are no longer visible
        - Will eat up all the memory

Decision: Every square outside the grid will be dead. This is a common
implementation, which will make the Game more familiar to users who have
seen others, with the added bonus of being simple to implement. Having every
square outside be alive or having the grid wrap around would introduce 
non-traditional, potentially confusing behavior, and having the grid zoom out is
not feasible.

##### How should we represent the game state?
Possible representations:
- 2D Array
    - Pros:
        - Natural, intuitive interpretation of game state
        - Update logic is simple
    - Cons:
        - Because the grid tends to be sparse, is a wasteful representation
          in terms of memory
- List of live cells
    - Pros:
        - Because the grid tends to be sparse, is an efficient usage of memory
    - Cons:
        - Update logic is complex
        - Reasoning about representation is less intuitive

Decision: A 2D Array will represent the game state. Conway's Game Of Life, while
it does take place on an infinite board, is most typically represented on a
board of finite and relatively small size; thus the concerns for wasted memory
are trivial in comparison to the implementation complexity introduced by keeping
a list of live cells.

To transition to the next time step, a new game state object will be created,
instead of mutating the previous game state, because the new state depends on
the old state. The immutability of the grid also helps avoid weird concurrency
bugs, since the animation is done asynchronously.

The grid will be a 2D array of booleans: live cells are true, and dead ones are
false. However, this representation makes it hard to view example and test
configurations. For this reason, example and test states are written as strings,
where '-' represents dead cells and '@' represent live ones. game_of_life.js
provides a method for translating these strings into their array counterparts.

##### How do we transition from state to state?
game_of_life provides a run function that draws the game, steps the state,
then calls itself asynchronously via window.setTimeout after a delay of a fixed
number of milliseconds. If the game converges, it would be a waste of resources
to continue this process, so the run method calls a callback and ends.

##### How do we interrupt a game in progress?
game_of_life keeps track of a few properties to accomplish this:
<code>running</code>, <code>stop</code>, and <code>callback</code>.
If a new game is started while <code>running</code>, <code>callback</code> is
set to a function that starts the new game, and <code>stop</code> is set to
true. Each step, the <code>run</code> function checks <code>stop</code> before
calling itself. Now that <code>stop</code> is true, <code>run</code> calls
the callback, which starts the new game, and terminates.

##### How can we best separate the game state from the view?
The object containing the game state will have a draw() function that is
responsible for creating the view. This function will be able to read
properties of the game state, but not modify them. This allows the game state
to be independent of the view, and for the method for rendering the view to
be easily changed from a graphics library to HTML/CSS manipulation.

## References
* Wikipedia article on Conway's Game Of Life: 
[http://en.wikipedia.org/wiki/Conway's_Game_of_Life]
(http://en.wikipedia.org/wiki/Conway's_Game_of_Life) 
* Sample implementation: 
[http://conwaysgameoflife.appspot.com/](http://conwaysgameoflife.appspot.com/)
* Portal cake icon reference image:
[http://img.photobucket.com/albums/1003/Athenaia/Icons/portal-cake.jpg]
(http://img.photobucket.com/albums/1003/Athenaia/Icons/portal-cake.jpg)
