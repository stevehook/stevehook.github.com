---
title: "Getting started with Elixir"
layout: post
---


## Some notes:

Elixir is:

    * A proper functional programming language
    * Fast
    * Robust
    * High-level
    * Has a great toolchain
    * Runs on the Erlang VM (Erlang is based on Prolog)


## Why Elixir matters




### Phoenix

Phoenix is a Web framework and like Rails did for Ruby, it is brining a
lot of attention. But whereas a lot of Ruby devs (even experienced ones)
have started with Rails and not ventured far from it, Elixir is much more
than just about building Web applications, so there is the potential for
Phoenix to be a kind of gateway drug into a bigger world of functional
distributed programming for the next generation.

Having said that, Phoenix is a cleverly thought out and well designed
framework in it's own right. It's also the de-facto Elixir Web framework
at this time so perhaps a lot of Elixirists will at least in the
short-term be 'Phoenix devs'. It achieves something special because
whilst it will feel instantly familiar to Rails developers it is very
different in a number of important ways. Ways that introduce you to new
concepts.

Phoenix isn't content with being Rails compatible, it introduces new
patterns and approaches that in some cases 'improve' on Rails or are more
appropriate in a functional language like Elixir. So, like Rails, it's
opinionated but doesn't necessarily share the same opinions. Rails has a
lot of the great ideas, there is no sense in discarding all of those,
but some of it's ideas don't translate to functional programming and
others are more generally 'wrong'.

I see a lot of parallels between the Hanami Web framework and Phoenix.
Both are a little more strict about separation of concerns than Rails.
Both take the view that sometimes explicit is better than magic even if
the trade-off is slightly more code. YMMV but always keep in mind that
the end goals is maintainability.


###mix

`mix` is a bit like  Ruby's `rake`. It's built into Elixir and extended
by different libraries.

####The basics

`hex` is Elixir's package manager (a lot like Ruby's Bundler) and also
works for Erlang.

    mix hex.info

lists some of the basic info about a project.

    mix deps

lists all your current packages.

    mix hex.outdated

lists hex packages for which newer versions are available.

    mix deps.update --all

or:

    mix deps.update <package>

can be used to update all or a given package.

###iex
There is no `rails console` in `Phoenix`, the more general command that
runs a REPL with all the dependencies loaded from your mix file is:

    iex -S mix


## Some resources:

    * http://elixir-lang.org/
    * http://www.phoenixframework.org/
    * https://howistart.org/posts/elixir/1 
