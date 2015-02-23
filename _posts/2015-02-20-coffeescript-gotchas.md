---
title: "A CoffeeScript gotcha"
layout: post
---

I like CoffeeScript, it is an improvement on plain JavaScript in many
ways but it's not without it's own drawbacks and gotchas.

##Implicit returns and _.forEach

So recently I spent some time staring at a piece of code that looked
something like this:

    _.foreach fruits, (fruit) ->
      if fruit.isApple()
        dontEatIt()
      else
        eatIt()

Here I'm using the excellent lodash library and it's `forEach` method to
iterate over a collection of fruits containing, lets say some oranges,
apples and a few bananas.

So I found that the code ran the way that I expected it to as it
processed oranges and bananas but as soon as I hit an apple it stopped
processing any more fruits. It wasn't until I read the docs for
`_.forEach` (that after a fair bit of head scratching) that I worked out
what was going wrong.

It just so happened that the `dontEatIt` method was returning `false`
value whereas the `eatIt` method returns a truthy value.  Add to this
the fact that you can terminate a `_.forEach` loop by simply returning
false from the callback and it all became clear, maybe I was being a bit
slow.

It seems `lodash` is consistent with `jQuery.each` in this respect,
though not with the new `Array.forEach` method introduced in ES5.
Also, to add to the confusion, `_.forEach` does not stop iterating if
you return one of JavaScript's many other falsey values, so if
`dontEatIt()` had simply returned undefined I would not seen this
problem.

##Would I choose to use CoffeeScript?

For some people it's use of significant whitespace is a major red flag
but I like using CoffeeScript from time to time. I took the trouble to
learn the basics 3-4 years ago when it was pretty new and being pushed
by the Rails community. Since then I've become less keen and haven't set
out to use it any projects where the choice is down to me.

There are a couple of reasons for this. Firstly, it adds another layer
of complexity to the tool chain and adds another layer that the
developer needs to understand. The important point here is that I still
need to know JavaScript as well to understand what I'm writing and to
debug any issues. And when a new developer joins the team, perhaps
fairly new to JavaScript, is it fair to expect her or him to pick up
both languages at once?

Secondly, ES6 addresses many of the same issues that CoffeeScript was
designed to fix so in the future there is going to be very little need
for it. So it seems as though its best years are behind it. I know the
feeling.
