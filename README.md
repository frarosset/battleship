# battleship

A project from The Odin Project (Full Stack Javascript).

A battleship game is built using HTML, CSS, and Javascript, and applying TDD.

> A preview is available [here](http://frarosset.github.io/battleship).

## Features

You can play in 2 player mode, or in 1 player mode. In the latter, you play against an AI that can have different skill levels, which define different applied stategies that are mostly based on [the approaches described here](https://www.datagenetics.com/blog/december32011/) and [here](https://towardsdatascience.com/coding-an-intelligent-battleship-agent-bf0064a4b319).

- **random**: choose just a (not yet attacked) random cell of the board.

- **huntTarget**: choose a random target as a base. However, when you score a hit, add the neighbouring cells
  which have not been attacked yet to some high priority list. When the high priority list is not
  empty, chose the next cell to attack among these instead of the global one.

- **imporvedHuntTarget**: the same as the huntTarget one. However, in hunt mode, not all cells are considered,
  but just the ones for which:
  ```math
  (row + col) % opponentMinShipSize === offset,
  ```
  where ```opponentMinShipSize``` is the minimum unsunk ship size of the opponent, and ```offset``` is a number between $0$
  and $opponentMinShipSize-1$, such that the set:
  ```math
  {(row,col) such that (row + col) % opponentMinShipSize === offset}
  ```
  of target cells has the minimum size.

- **probabilistic**: a frequency map is computed considering each possible target cell, counting all the ways an unsunk ship could
  be placed in there. Each possibility is weighted $1$. However, if the the ship in a given position crosses
  $N$ hit cells, the weight is $100^N$. This helps prioritizing the cells close to the hit ones.
  
  The cell with the highest frequency is selected. If there is more than one with the same maximum frequency, one of
  them is chosen randomly.

 - **improvedProbabilistic**: when in target mode (i.e., there are hit cells which are not of sunk ships), apply the probabilistic strategy.
   Otherwise, in hunt mode, consider just the selected cells considering parity (see *improvedHuntTarget* strategy), and in
   particular their squared frequencies, from which a probability is recomputed. Then, select a random cell among these cells,
   taking into account such probabilities. In this way, at the beginning it is more probable to choose a cell in the middle,
   however, there is no the guarantee to be chosing exactly one of those.

Also, you can place your fleet randomly, or customize its deployment by interacting with the UI: rotating around the clicked cell, or translating it via drag-and-drop.

