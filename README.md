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

1. Clone ou télécharge ce dépôt<br/>
Ouvre un terminal ou Git Bash, et place toi dans ton répertoire de travail:<br/>
(ajuste le chemin d'accès à ton répertoire de travail)
```bash
cd /c/Users/ton_compte/Documents/ObsidianPlugins
```
```bash
git clone https://github.com/123vincent/PGN-Translator.git
cd PGN-Translator
```

2. Exécute `npm install` puis `npm run build`<br/>
(Nécessite d'avoir installer [Node.js (LTS version)](https://nodejs.org/) au préalable)
```bash
npm install
npm run build
```

4. Copie le contenu généré (`main.js`, `manifest.json`) dans ton coffre (vault) Obsidian: `.obsidian/plugins/pgn-translator`

5. Dans Obsidian:
 - Va dans **Options → Modules complémentaires**
 - Dans la liste **Modules installés**
 - Active **PGN-Translator**
