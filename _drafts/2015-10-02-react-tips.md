---
title: "Starting React.js and trying to keep it simple"
layout: post
---

It's easy to start with good intentions and then get sucked into an
unnecessarily complicated toolchain. Maybe it's best to start with a minimal
setup.

##Starting simple

When starting a new project in a language or framework that I'm still
learning it's hard to resist the urge to throw a whole load of tools and
libraries into the project from the start just in case we might need
them later. But YAGNI!

With front-end dev the temptation to overcomplicate things is
particularly strong for me partly because the turnover of shiny new
tools and JS frameworks is so rapid but also because it's not something
I do every day.

##Focus on what you really need

So I'm trying to build a simple TODO list and I want to
focus on learning React.js in it's simplest form to begin with.

All I want to begin with is:

    * a tool to manage dependencies on the short list of JS libraries I really need.
        I am going to be keeping that list of dependencies as short as
        possible but the point of the exercise isn't to build everything
        from the DOM up so I want something to download, install and
        maintain those.
    * a transpiler to convert my ES6 code into regular JS -
        I want to start using ES6 (or ES2015). I'll want this to be
        watching changes on the file system and rebuilding automatically.
    * a test framework - I want to have the option of building
        some of my code in a test-driven way but it needs to be simple
        otherwise it'll just become a distraction.
    * a development Web server that serves just my front-end stuff - So
        that I can play about with it without needing to worry about
        how it integrates with whatever backend API I happen to be
        using.
    * a place to keep a few scripts - There will be a few simple tasks I'll
        be running repeatedly like starting the dev server or running my
        test (if I get round to writing any).

Above all I want the tools that I choose to be easily replaceable in the
future when requirements change, I'm pretty sure that I will make
some wrong choices at the beginning.

##So many options

When I've done this kind of thing before I've been tempted to scaffold
my project with Yeoman. This is great for getting up and running but it
doesn't always help me to learn what I was trying to learn. For a start
it drags in a lot of different tools. For example, you might end up with
something like:

    * Bower for front-end package management.
    * Gulp or Grunt for task management and automation.
    * A test framework like Mocha or Jasmine and their sub-packages.
    * Other testing libraries like sinon for mocking, karma for browser
        testing and so on.
    * Various precompilers and transpilers that convert your HTML,
        JavaScript and stylesheets from one form to another.
    * Linters to make sure my code isn't too nasty.
    * A CSS framework like Bootstrap.
    * Lots of JavaScript libraries that I might not need like jQuery.

All of these things are great at what they do but I don't need them all
at the start and more importantly perhaps I don't really understand what
Yeoman has generated for me. For example, taking a peek at the Gruntfile
I see a lot of stuff that I don't understand. Without knowing all that
stuff it's hard then for me to customise and extend what I've got.

##Start simple

###npm

So let's start by seeing how far I can get just with npm as a package
manager. I already have a reasonable idea of how this works and a
`package.json` doesn't look too scary. And I've heard that it is a
perfectly good front-end package manager. So to start with I can just
use npm to declare and install some dependencies starting with React:

    $ cat package.json
    {
      "name": "todo-app",
      "version": "0.0.1",
      "description": "React.js Todo app",
      "dependencies": {
        "react": "^0.14.0"
      },
      "devDependencies": {
        "browserify": "^6.2.0",
        "envify": "^3.0.0",
        "reactify": "^0.15.2",
        "uglify-js": "~2.4.15",
        "watchify": "^2.1.1"
      },
      "author": "Steve",
      "browserify": {
        "transform": [
          "reactify",
          "envify"
        ]
      }
    }

    $ npm install

###Browersify

The other thing I need is something to help me integrate my own
JavaScript code with React and other dependencies. So that is why I've
got references to Browserify and some associated plugins in the `devDependencies`
section.

Browserify lets you write browser-side code as though it were running in
node.js. In particular, it lets us use node's module system so that we
can modularise our own code and `require` our dependencies, e.g.:

    const React = require('react');

    const MyComponent = React.createClass({
      ...
    });

    module.exports = MyComponent;

Because we have declared `react` as a dependency in our package.json we
can import it using `require` and we can export `MyComponent` so that it
can in turn be required in other modules.

##Enabling ES6

It's probably about time I stopped just writing old-school JavaScript
so.

###Babel

Babel is a JavaScript compiler that takes ES6 or more properly ES2015
and converts it to ES5 that even older browsers understand. It's
pluggable and works well with Browserify.

I added the following config to my `package.json`. This
sets Browserify up to include Babel transforms as part of the build
process. I've also configured Babel itself to use a package of preset
transforms for ES2015 (you can pick and mix which language features you
want to use).

    "browserify": {
      "transform": [
        "babelify",
        "envify"
      ]
    },
    "babel": {
      "presets": [
        "es2015"
      ]
    },

##A little automation

By this stage I've already got a handful of tasks that I need to run
repeatedly. I don't want to type long commands and I might forget what
they are if I revisit the project in a month's time. I could add Grunt
or Gulp to solve these problems but it turns out I already have a tool
to do this, npm.

You can add these tasks to the scripts section of `package.json`. For
example:

    "scripts": {
      "start": "watchify -o js/bundle.js -v -d js/app.js",
      "build": "browserify . -t [envify --NODE_ENV production] | uglifyjs -cm > js/bundle.min.js",
      "serve": "node_modules/.bin/http-server --cors --proxy http://localhost:9292/",
      "test": "mocha --compilers js:babel-core/register --recursive"
    },

Here I've defined scripts for the first four tasks I need:

    * `start` runs watchify continuously so that as I update my
        JavaScript source files the `bundle.js` is automatically
        regenerated.
    * `build` creates a minified and uglified version of my `bundle.js`
        for production.
    * `serve` runs a tiny development Web server to let me play about
        with the front-end. It only serves static content and I've got
        my dynamic content running in a separate backend API Web server
        on port 9292 so that's why I am proxying unknown requests to
        `localhost:9292`.
    * `test` runs my tests. I'm using mocha here but that'll need
        another post to describe properly.

I can run any of these scripts with the `npm run` command, e.g.

    $ npm run build

The `test` and `start` tasks are 'standard' tasks and can be run
without the `run` command, e.g.

    $ npm test

I will no doubt need more than this if and when the project gets any
more complicated but for now it does the job and I can easily add to
this list.

##Conclusion

I'm quite happy with the tools I have and I feel I have a reasonable
understanding of what I've set up. That means I am in a pretty good
position to change it going forward. I like simple.
