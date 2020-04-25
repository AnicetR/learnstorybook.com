---
title: 'Guide : Storybook pour React'
tocTitle: 'Commencer'
description: 'Mettre en place Storybook dans votre environnement de développement'
commit: ebe2ae2
---

Storybook fonctionne en parallèle de votre application en mode développement. Il vous aide à construire des éléments d'UI isolés de la logique métier et du contexte de votre application. Cette version du guide "Apprendre Storybook" est dédiée React. D'autres versions (en anglais) existent pour [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) et [Svelte](/svelte/en/get-started).

![Storybook et votre application (en anglais)](/intro-to-storybook/storybook-relationship.jpg)

## Mettre en place Storybook pour React

Nous devons suivre quelques étapes pour mettre en place le processus de build dans votre environnement. Pour commencer, nous allons utiliser [Create React App](https://github.com/facebook/create-react-app) (CRA) pour mettre en place le système de build et activer [Storybook](https://storybook.js.org/) et [Jest](https://facebook.github.io/jest/) afin de tester l'app ainsi créée.
Lançons les commandes suivantes : 

```bash
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Au long de cette version du guide, nous allons utiliser <code>yarn</code> afin de lancer la majorité des commandes.
Si vous avez yarn d'installé mais que vous préférez utiliser <code>npm</code> à la place, pas de problème, vous pouvez toujours suivre ce guide sans aucun soucis. Ajoutez simplement le paramètre <code>--use-npm</code> à la première commande ci-dessus, ainsi CRA et Storybook s'initialiseront correctement. Aussi, tout au long du guide, n'oubliez pas d'ajuster les commandes afin d'utiliser leurs équivalents <code>npm</code>.
</div>


Nous vérifions rapidement que les divers environnements de notre application fonctionnent correctement :

```bash
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 9009:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
Vous avez peut-être remarqué que nous avons ajouté le paramètre <code>--watchAll</code> à la commande de test. Ne vous inquiétez pas, c'est normal : ce petit changement nous assure que tous les tests fonctionnent et que tout est ok avec notre application. Lors de votre progression dans ce guide, differents scenarios de tests vous seront introduits, il est alors interessant d'ajouter ce paramètre au script de test dans votre <code>package.json</code> afin de s'assurer que tous vos tests se lancent correctement.
</div>

L'app dispose désormais de trois modes de fonctionnement : test automatisés (Jest), développement de composants (Storybook), et l'application en elle-même.

![3 modes de fonctionnement](/intro-to-storybook/app-three-modalities.png)

En fonction de la partie de l'app sur laquelle vous travaillez, vous aurez peut-être besoin de lancer un ou plusieurs modes de fonctionnement simultanément. Dans ce guide nous nous concentrons sur la création de composants d'UI simples, nous ne lancerons donc que Storybook.

## Réutilisation des CSS

Taskbox réutilise les éléments de designs du ["GraphQL and React Tutorial"](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858) (en anglais), nous n'aurons donc pas besoin d'écrire de CSS dans ce guide. Copiez-collez [ce code CSS compilé](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dans le fichier `src/index.css`. (ndt: *Taskbox* est conservé en anglais tout au long du guide de sorte à correspondre au mieux aux extraits de codes/screenshots présentés, c'est aussi le cas pour *Task*, *TaskList*... etc)

![UI de Taskbox (/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si vous voulez modifier l'apparence, les sources LESS sont disponibles sur le dépot Github.
</div>

## Ajouter les assets

Afin de correspondre au desgin recherché, vous aurez besoin de télécharger les dossiers 'icon' et de 'font' et de placer leurs contenus dans votre dossier `public`.

<div class="aside">
<p>Nous avons utilisé <code>svn</code> (Subversion) afin de télécharger simplement un dossier de fichiers depuis Github. Si vous n'avez pas subversion d'installé ou que vous ne voulez pas l'utiliser, vous pouvez récupérer les dossiers directement <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">ici</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```


Après avoir ajouté les styles et les assets, l'application aura un rendu *étrange*. C'est normal : nous n'allons pas travailler sur l'application mais sur les composants dans StoryBook. Nous allons plutôt commencer en construisant notre premier composant !
