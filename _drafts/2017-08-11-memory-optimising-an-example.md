---
title: "Memory optimisation - a case study"
layout: post
---

If you are a developer with a laptop with 16GB RAM (as you should) then
it's quite likely that you will not see any memory usage issues your might have until your
application runs on production hardware.

For example, suppose you have a batch job that needs to run nightly.
Heroku Scheduler is great for this sort of of thing and it's reasonable
to run it on a single Heroku dyno because it isn't performance (speed)
critical. The only problem is that single dynos are limited to 512MB of
memory. This shouldn't be an issue normally unless are you abusing
your RAM chips.

