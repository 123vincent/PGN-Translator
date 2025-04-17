# PGN Translator

Ce plugin Obsidian convertit automatiquement les notations d’échecs de l’anglais (PGN) vers le français (NGP), et inversement.

## Fonctionnalités

- Conversion automatique à la sortie du bloc de code `pgn`
- Support des captures, promotions, roques
- Bloc YAML : `pgn:` → `ngp:` automatiquement
- Réglages dans l’interface Obsidian

## Exemple

```pgn
pgn: 1. e4 e5 2. Nf3 Nc6 3. Bxc6
```

Devient :

```pgn
pgn: 1. e4 e5 2. Nf3 Nc6 3. Bxc6
ngp: 1. e4 e5 2. Cf3 Cc6 3. Fxc6
```

## Installation manuelle

1. Clone ou télécharge ce dépôt
2. Exécute `npm install` puis `npm run build`
3. Copie le contenu généré (`main.js`, `manifest.json`, etc.) dans `.obsidian/plugins/pgn-translator`
