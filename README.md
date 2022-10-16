# Information
While browsing the web for new projects to do I found a subreddit called
[/r/roguelikedev](https://www.reddit.com/r/roguelikedev) which hosts an annual event where the participants build their
own roguelike games. The tutorial can be found [here](https://rogueliketutorials.com/) and is written for Python 3.
One can also find participants from previous events and their contributions on their
[wiki-page](https://www.reddit.com/r/roguelikedev/wiki/python_tutorial_series/#wiki_directory_of_participants).

Since I have already done a lot of coding in Python, both at work and on my free time, I wanted to try something new.
Therefore, this project will be written in TypeScript. A programming language I know basically nothing about, apart
from that it can be considered an enhanced version of JavaScript. As can be seen in the previous link, there are already
people who have done this in TypeScript. Which means that this is not an impossible undertaking.

This README file will be written continously as I following along with the tutorial and will be split up into different
chapters which correspond to the different parts from the tutorial.

## Part 0 - Getting started
While browsing the subreddit a bit more I actually found a
[tutorial for TypeScript](https://klepinger.dev/rotjs-tutorial) written by someone by the name of Nik Klepinger. The
idea is to follow this tutorial instead of the one linked above.

### Setting up the environment
Since I have never used TypeScript previously the first step is to find the documentation for how to get started with
that. On the [official page](https://www.typescriptlang.org/download) there are two ways to install/download it; via npm
or via Visual Studio. The tutorial by Nick says that we should be using 'npm'. This appears to be some sort of package
manager for JavaScript which can be accessed by installing Node.js from their [webpage](https://nodejs.org/en/).

Once that is installed, alongside with all dependencies, simply run <code>npm install typescript --save-dev</code>
from a command prompt to install TypeScript. There are two other packages that needs to be installed:
- ViteJs
- ROT

There is a short explanation about what they are in Nicks tutorial. But in short, [**ViteJs**](https://vitejs.dev/) is a "ridiculously fast" (according to Nick) dev server and [**ROT**](https://ondras.github.io/rot.js/hp/) is a roguelike toolkit.

ROT is installed by running <code>npm install rot-js</code> and the development server is set up by running:
```
npm create vite@latest js-rogue-tutorial
# Choosing 'Vanilla' and 'TypeScript' in the prompts that show up
cd js-rogue-tutorial
npm install
```

### First lines of code
After the installation is complete the development server is started up running
```
npm run dev
```
inside the folder <code>js-rogue-tutorial</code>. If the following text is visible in the terminal
```
  VITE v3.1.8  ready in 202 ms

  ➜  Local:   http://127.0.0.1:5173/
  ➜  Network: use --host to expose
```
the server is successfully started and can be accessed in a browser by visiting the adress provided.

Now, the first lines of code can be found in the file [main.ts](js-rogue-tutorial\src\main.ts) if looking at
[this branch](https://github.com/timfornell/RogueLikeTypeScript/tree/Tutorial_Part0).