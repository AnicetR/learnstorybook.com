---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
commit: 403f19a
---

Nous allons construire notre UI en suivant une méthodologie de [Développement orienté composant (Component-Driven Development)](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD). C'est un processus qui consiste à construire notre UI de "bas en haut", en commençant par les composants et en terminant par les écrans. CDD permet d'échelonner le niveau de complexité auquel vous devez faire face lorsque vous construisez votre UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` est le composant principal de notre application. Chaque *task* s'affiche légèrement differemment en fonction de l'état dans lequel elle est. Nous affichons une checkbox cochée (ou décochée), quelques informations à propos de la tâche et un bouton "épingler" (pin dans le code), qui nous permettra de bouger une *task* en haut ou en bas de la liste. Afin d'obtenir ce comportement, nous aurons besoin de ces props:

- `title` – une chaine de caractères décrivant la *task*
- `state` - dans quelle liste est la *task* actuellement et si elle est cochée

Alors que nous commençons à construire `Task`, nous allons commencer par écrire nos états (`states`) de test, correspondant aux differents types de *tasks* présentés plus haut dans l'image. Nous utiliserons en suite Storybook afin de construire le composant en isolation en utilisat de données factices (*mocked data*). Nous allons "tester visuellement" l'apparence du composant pour chaque état au fur et à mesure.

Ce processus est similaire au [Développement orienté tests (Test-driven development)](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) que nous pouvons alors appeler "[TDD Visuel](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)".

## Mise en place

Premièrement, nous allons créer le composant *task* et son fichier de *story* correspondant: `src/components/Task.js` et `src/components/Task.stories.js`.

Nous commencerons avec un implémentation simple du composant `Task`, en prenant simplement les attributs dont nous savons avoir besoin ainsi que les deux actions possibles sur une *task* (afin de la déplacer entre les lists) :

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Au dessus, nous envoyons au rendu une écriture simple pour `Task` basé sur la structure HTML de la *Todos app*.

En dessous, nous allons construire les trois états de test pour `Task` dans le fichier de story:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => <Task task={{ ...taskData }} {...actionsData} />;

export const Pinned = () => (
  <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />
);

export const Archived = () => <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />;
```

Il y a deux niveaux d'organisation basique dans Storybook : le composant et ses stories enfants. Il faut voir chaque story comme une permutation du composant. Vous pouvez avoir autant que stories par composant que vous le désirez.

- **Component**
  - Story
  - Story
  - Story

Afin de donner à Storybook les informations du composant que nous documentons, nous avons à créer un export `default` qui doit contenir :

- `component` -- the component itself,
- `title` -- how to refer to the component in the sidebar of the Storybook app,
- `excludeStories` -- exports in the story file that should not be rendered as stories by Storybook.

Afin de définir nos stories, il faut exporter une fonction pour chacun de nos tests afin de générer la story correspondante. La story est une fonction qui renvoie un élément rendu (i.e. un composant avec une liste définie de props) dans un étant donné. Exactement comme un [composant sans état (Stateless Functional Component)](https://reactjs.org/docs/components-and-props.html)

`action()` nous permet de créer un callback qui apparait dans le panneau **actions** de l'interface de Storybook. Donc lorsque nous construiront le bon "épingler", nous serons capable de déterminer depuis l'UI de test si le clique fonctionne.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actionsData` variable and use React's `{...actionsData}` props expansion to pass them all at once. `<Task {...actionsData}>` is equivalent to `<Task onPinTask={actionsData.onPinTask} onArchiveTask={actionsData.onArchiveTask}>`.

Another nice thing about bundling the actions into `actionsData` is that you can `export` that variable and use the actions in stories for components that reuse this component, as we'll see later.

When creating a story we use a base task (`taskData`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We'll need to make a couple of changes to the Storybook configuration so it notices not only our recently created stories, but also allows us to use the CSS file that was changed in the [previous chapter](/react/en/get-started).

Start by changing your Storybook configuration file (`.storybook/main.js`) to the following:

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: ['@storybook/preset-create-react-app','@storybook/addon-actions', '@storybook/addon-links'],
};
```

After completing the change above, inside the `.storybook` folder, add a new file called `preview.js` with the following:

```javascript
// .storybook/preview.js

import '../src/index.css';
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
           // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

It’s best practice to use `propTypes` in React to specify the shape of data that a component expects. Not only is it self documenting, it also helps catch problems early.

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};
```

Now a warning in development will appear if the Task component is misused.

<div class="aside">
An alternative way to achieve the same purpose is to use a JavaScript type system like TypeScript to create a type for the component properties.
</div>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because it’s a quick way to view the new version of a component and check out the changes.

<div class="aside">
Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding the following development dependencies:

```bash
yarn add -D @storybook/addon-storyshots react-test-renderer
```

Then create an `src/storybook.test.js` file with the following in it:

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

That's it, we can run `yarn test` and see the following output:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We now have a snapshot test for each of our `Task` stories. If we change the implementation of `Task`, we’ll be prompted to verify the changes.
