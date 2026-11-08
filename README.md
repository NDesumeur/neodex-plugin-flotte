# Flotte

La bataille navale contre l'ordinateur : chacun cache cinq navires sur sa grille, et on tire à tour de rôle pour couler la flotte d'en face. Le premier qui coule tous les navires adverses gagne.

*English version: [README.en.md](README.en.md)*

## Comment jouer

- Ta flotte est à gauche, celle de l'ordinateur (cachée) à droite. **Clique une case de la grille d'en face** pour tirer.
- **Touché** : tu rejoues tout de suite. **À l'eau** : c'est au tour de l'ordinateur, qui suit la même règle.
- Quand un navire est coulé, l'eau tout autour est marquée d'office : les navires ne se touchent jamais, pas même par un coin.
- **Nouvelle partie** replace les deux flottes au hasard.

## Les flottes

Deux grilles de 10 × 10 et cinq navires de chaque côté : un de 5 cases, un de 4, deux de 3 et un de 2, placés au hasard, horizontaux ou verticaux, sans se toucher.

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
