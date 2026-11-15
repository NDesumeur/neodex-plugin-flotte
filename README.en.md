# Flotte (Fleet)

Battleship against the computer: each side hides five ships on its grid, and you take turns firing to sink the other fleet. The first to sink every enemy ship wins.

*Version française : [README.md](README.md)*

## How to play

- **Before the battle**, place your fleet on the left grid: **drag** a ship to move it, **one click** on it turns it (it shifts a little if it does not fit). A green or red frame shows whether it can go there. **At random** places your whole fleet again, **Fight!** (or Enter) starts the game.
- Your fleet is on the left, the computer's (hidden) on the right. **Click a cell on the opposing grid** to fire.
- **Hit**: you fire again straight away. **Miss**: it is the computer's turn, and it follows the same rule.
- When a ship is sunk, the water all around it is marked automatically: ships never touch, not even at a corner.
- Every shot is animated: an **explosion** with debris and smoke on a ship that is hit, a **water splash** and rings in the water next to it. A sunk ship blows up square by square, then shows up, blackened.
- **New game** places both fleets at random again and reopens placement.
- **Full screen**: the button of the same name; Escape to leave it. The play area fits the size of the window.

## The fleets

Two 10 × 10 grids and five ships per side, each one drawn: the **carrier** (5 cells, runway and planes on deck), the **battleship** (4, three turrets), the **cruiser** (3), the **submarine** (3, conning tower and periscope) and the **destroyer** (2). Horizontal or vertical, they never touch, not even at a corner. The opposing fleet is placed at random.

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
