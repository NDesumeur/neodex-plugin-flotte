# Flotte

La bataille navale contre l'ordinateur : chacun cache cinq navires sur sa grille, et on tire à tour de rôle pour couler la flotte d'en face. Le premier qui coule tous les navires adverses gagne.

*English version: [README.en.md](README.en.md)*

## Comment jouer

- **Avant la bataille**, place ta flotte sur la grille de gauche : **glisse** un navire pour le déplacer, **un clic** dessus le tourne (il se décale un peu s'il ne tient pas). Un cadre vert ou rouge montre s'il peut se poser là. **Au hasard** replace toute ta flotte, **Combat !** (ou Entrée) lance la partie.
- Ta flotte est à gauche, celle de l'ordinateur (cachée) à droite. **Clique une case de la grille d'en face** pour tirer.
- **Touché** : tu rejoues tout de suite. **À l'eau** : c'est au tour de l'ordinateur, qui suit la même règle.
- Quand un navire est coulé, l'eau tout autour est marquée d'office : les navires ne se touchent jamais, pas même par un coin.
- Chaque tir s'anime : une **explosion** avec des éclats et de la fumée sur un navire touché, une **gerbe d'eau** et des ronds dans l'eau à côté. Un navire coulé explose case par case puis apparaît, noirci.
- **Nouvelle partie** replace les deux flottes au hasard et rouvre le placement.
- **Plein écran** : le bouton du même nom ; Échap pour en sortir. La zone de jeu s'adapte à la taille de la fenêtre.

## Les flottes

Deux grilles de 10 × 10 et cinq navires de chaque côté, chacun dessiné : le **porte-avions** (5 cases, piste et avions sur le pont), le **cuirassé** (4, trois tourelles), le **croiseur** (3), le **sous-marin** (3, kiosque et périscope) et le **torpilleur** (2). Horizontaux ou verticaux, ils ne se touchent jamais, pas même par un coin. La flotte d'en face est placée au hasard.

## L'amiral d'en face

- **Facile** : il tire au hasard.
- **Normal** : il tire en damier pour trouver tes navires plus vite (en tenant compte du plus petit navire qu'il te reste), puis achève méthodiquement chaque navire qu'il a touché.

## Statistiques

Le panneau Records montre tes **victoires** sur le nombre de parties et ta **victoire la plus rapide** (le moins de tirs), pour le niveau choisi.

## Données et synchronisation

Tes victoires et tes records sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Flotte → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
