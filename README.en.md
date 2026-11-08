# Flotte (Fleet)

Battleship against the computer: each side hides five ships on its grid, and you take turns firing to sink the other fleet. The first to sink every enemy ship wins.

*Version française : [README.md](README.md)*

## How to play

- Your fleet is on the left, the computer's (hidden) on the right. **Click a cell on the opposing grid** to fire.
- **Hit**: you fire again straight away. **Miss**: it is the computer's turn, and it follows the same rule.
- When a ship is sunk, the water all around it is marked automatically: ships never touch, not even at a corner.
- **New game** places both fleets at random again.

## The fleets

Two 10 × 10 grids and five ships per side: one of 5 cells, one of 4, two of 3 and one of 2, placed at random, horizontal or vertical, without touching.

## The opposing admiral

- **Easy**: fires at random.
- **Normal**: fires in a checkerboard pattern to find your ships faster (taking into account the smallest ship you have left), then methodically finishes off every ship it has hit.

## Statistics

The Records panel shows your **wins** out of games played and your **fastest win** (fewest shots), for the chosen level.

## Data and sync

Your wins and records are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Flotte → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
