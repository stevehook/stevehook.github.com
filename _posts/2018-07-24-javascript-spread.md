---
title: "JavaScript spread operator and Redux reducers"
layout: post
---

The JavaScript spread operator (`...`) can help us write more
declarative code for manipulating and copying objects.

## Redux and state mutation

Redux reducers are used to transform the application state from the old
state to a new state in response to an _action_. It's critical that we
don't modify the old state value when creating the new. In other words
reducers are _pure functions_.

As such it's important to make sure that you don't trample on the
previous state when you are processing an action.

Here's an example, suppose you start off with this state:

    {
      people: {
        bob: {
          id: 123,
          state: 'Happy',
        },
        alice: {
          id: 456,
          state: 'Sad'
        }
      }
    }

And want to process this action:

    {
      action: 'MAKE_HAPPY',
      user: 'alice'
    }

We can't just do (in a reducer):

    const makeHappy = (state, action) => {
      state.people[action.user].state = 'Happy';
      return state;
    };

Because this would alter the original state as well as returning the
'right' answer. Instead we need to create a fresh copy of our state,
modify it and return the modified copy.

## Using `Object.assign` to clone and modify
`Object.assign` allows us to fairly cleanly copy and modify an object.
In order to avoid modifying the original we work from the inside out
starting with a cloned and modified 'person' object then we do the same to
the 'people' collection and finally the top-level state object.

    const makeHappy = (state, action) => {
      const newUser = Object.assign({}, state.people[action.user], { state: 'Happy' });
      const people = Object.assign({}, state.people);
      people[action.user] = newUser;
      const newState = Object.assign(state, people);
      return newState;
    };

Note that we didn't have to clone any of the people objects that were
not being modified - it's fine to use the original value in such cases
and cloning the whole state tree could get prohibitively expensive.

Even so it's pretty long-winded so can Object spread make it any better?

## Using Object spread to clone and modify
The object spread operator allows us to do much the same as the
`Object.assign` method but in a less verbose and more declarative way:

    const makeHappy = (state, action) => {
      const newUser = { ...state.people[action.user], state: 'Happy' };
      const people = { ...state.people };
      people[action.user] = newUser;
      const newState = { ...state, people };
      return newState;
    };

## Shortcuts and pitfalls
Both `Object.assign` and the spread operator only create a shallow copy
of an object. So for example...

    const originalState = { bob: { name: 'Robert' };
    const newState = Object.assign({}, originalState);
    newState.bob.age = 42;

...mutates the nested object within `originalState`. `Object.assign`
clones `originalState` but because the key `bob` is just a reference to
the original `{ name: 'Robert' }` object, changing *that* object
changes the nested original state - which is exactly what you don't want
to happen in a Redux reducer.

Writing pure functions like Redux can be a little challenging, code can
be a bit verbose. If you find it's also error prone then it might be
time to consider using the Immutable library to guard against unwanted
state mutations in a way that native JavaScript collections cannot do.
