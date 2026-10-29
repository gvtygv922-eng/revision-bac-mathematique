# Révisions Bac — Maths

Site d'entraînement interactif (HTML + CSS + JavaScript, aucun serveur, aucune clé). Il fonctionne dans le navigateur et garde ta progression sur ton appareil.

## Publier le site sur GitHub Pages (pas à pas)

1. Va sur <https://github.com> et crée un compte gratuit (ou connecte-toi).
2. Clique sur **+** (en haut à droite) puis **New repository**.
3. Nom du dépôt : par exemple `revisions-bac`. Choisis **Public**. Ne coche rien d'autre. Clique **Create repository**.
4. Sur la page du dépôt vide, clique sur **uploading an existing file**.
5. Dézippe `revisions-bac.zip` sur ton ordinateur. Ouvre le dossier obtenu, **sélectionne tout son contenu** (le fichier `index.html`, les dossiers `css`, `js`, `tests`, etc.) et glisse-le dans la page GitHub.
   Important : `index.html` doit être à la racine du dépôt, pas dans un sous-dossier.
6. Attends la fin du chargement, puis clique sur **Commit changes**.
7. Va dans **Settings** (onglet du dépôt) → **Pages** (menu de gauche).
8. Dans **Build and deployment**, choisis **Source : Deploy from a branch**. Branche : **main**, dossier : **/ (root)**. Clique **Save**.
9. Attends 1 à 2 minutes et rafraîchis la page : le lien apparaît en haut, sous la forme `https://TON-PSEUDO.github.io/revisions-bac/`.

Ce lien est permanent. Pour mettre le site à jour plus tard, retourne dans le dépôt → **Add file → Upload files** et remplace les fichiers modifiés.

## Utiliser le site

- **Accueil** : choisis un chapitre et une difficulté, puis *Commencer*.
- Les exercices **originaux** (ceux de tes documents) passent en premier, puis des exercices **générés** sur le même modèle avec d'autres nombres.
- **Erreur** : le site affiche la réponse, la méthode pas à pas et les erreurs fréquentes. Il te propose ensuite 3 exercices du même type, puis l'exercice raté revient. Raté encore : nouveau cycle ; réussi : il sort de la liste « à revoir ».
- **Ma progression** : réussites, erreurs, taux par chapitre, exercices à retravailler. Tu peux exporter/importer ta progression (fichier .json) pour la changer d'appareil.
- **Recommencer la série** (accueil) remet à zéro les originaux et la liste « à revoir » de la sélection en cours (les statistiques sont conservées).

## Formats de réponse acceptés

Virgule ou point (`0,75` / `0.75`), fractions (`3/4`, `6/8`), pourcentages, puissances (`x^2` ou `x²`), expressions équivalentes (pour une forme développée, canonique ou factorisée, la forme demandée est aussi vérifiée), ensembles de solutions (`2 ; 5`, `∅`), couples `(2 ; −3)`.

## Organisation des fichiers

```
index.html            page unique
css/style.css         apparence (clair/sombre, mobile)
js/core.js            outils : hasard, fractions, graphiques SVG, QCM
js/checker.js         correcteur (expressions, fractions, ensembles…)
js/store.js           progression (localStorage) et choix de l'exercice suivant
js/app.js             interface
js/exercises/*.js     un fichier par chapitre (33 modèles d'exercices)
tests/run.js          test automatique : node tests/run.js
```

## Ajouter un exercice

Dans le fichier du chapitre, ajoute un `RB.register({ id, chapter, theme, difficulty, title, originals: [...], generate(r) { ... } })`. `originals` contient les exercices fournis (jamais modifiés) ; `generate(r)` crée des variantes avec `r.int(a,b)`, `r.pick([...])`. Chaque exercice renvoie `statement`, soit `qcm` soit `fields`, `steps` (méthode) et `pitfalls` (erreurs fréquentes). Lance `node tests/run.js` : il vérifie que chaque variante est valide et que la bonne réponse est acceptée.
