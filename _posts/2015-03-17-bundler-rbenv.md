---
title: "Switching to rbenv - with a quick recap of gems and bundler"
layout: post
---

If you work on multiple projects and those projects use different
versions of Ruby you need some means of switching between different
rubies. `rbenv` is a Ruby version manager and solves this problem, without
attempting to do too much else.

To understand `rbenv` we first need to a quick recap of RubyGems and
Bundler.

##RubyGems

RubyGems is the package management framework for Ruby. In modern
versions of Ruby it's a built-in, though it used to be a separate
add-on. Ruby packages are known as *gems* and can be installed using the
`gem` command, e.g.

    $ gem install rails

You can list installed gems with:

    $ gem list

You can also use the `gem` command to create and build new Ruby gems but
we won't go into that here.

##Bundler

Each gem declares a list of dependencies, for example the `rails` gem
depends on several other gems like `activesupport`, `activerecord`,
`actionpack` and several others. The `gem` command itself will ensure
that whenever you install a particular gem it's dependencies are
installed but it doesn't help when it comes to managing the dependencies
for a complete project.

For example a typical Rails project is likely to have dependencies on
several dozen if not a hundred or more gems. Each gem will declare a
version or more commonly a version constraint for each of it's
dependencies so the process of working out which set of gem versions is
required to run a particular application is non-trivial so taking care
of this manually is going to be tough. And even if you do manage to get
a compatible set of gems installed on your dev machine how are going to
ensure that the same gems are installed on your team-mates computers let
alone the production server?

This is where Bundler comes in, it manages gem dependencies for us. For
each project we can create a `Gemfile` to declare what our project
needs, including rules about the versions we need. Bundler then helps:

* Install gem dependencies - making sure a compatible set of version is
    available to your application.
* Ensure that the right gems are loaded at runtime.

Bundler has been around for a while now but seasoned Ruby developers
will be able to tell you about pre-bundler days, I'm not sure how they
managed without it.

Having created a Gemfile or checked out a project with a Gemfile and
Gemfile.lock you can install the full set of gems required for that
project with:

    $ bundle install

The first time you run this Bundler will create a `Gemfile.lock` for
you, this lists all the gems and the versions that you have
installed. You check this into version control so that your colleagues
end up installing exactly the same versions of each gem. That's the
basic idea, though there are a few other Bundler commands to learn.

##rbenv

`rbenv` works by creating a directory of *shims* for each Ruby executable
(like `ruby`, `irb` and `gem`), and ensures that those appear in your
`PATH` variable before the actual Ruby installation directories. The
shims themselves work out which Ruby version to use based on an optional
environment variable `RBENV_VERSION` or more likely a `.ruby-version`
file in the root of your project directory or failing that a *global*
version.

`rbenv` needs to be hooked into your shell in order to set up it's
shims, e.g. I've got the following line in my `.zlogin` file:

    eval "$(rbenv init -)"

The shims that `rbenv` needs have to be updated from time to time, such
as when you install a new gem that contains a new executable (e.g. you
install `rspec`). Rebuilding the shims is known as *rehashing* and is
done automatically as part of the `rbenv` initialisation when you open a
new shell, though it can also be done manually with the `rbenv rehash`.

Ruby versions are installed under the `~/.rbenv/versions` directory,
though `rbenv` defers to `ruby-build` to do the job of installing them.
You can install a particular Ruby version as follows:

    $ rbenv install 2.3.0

Or if you aren't sure which one you need you can list the available
rubies with:

    $ rbenv install -l

###rbenv and Bundler

`rbenv` is designed to do just enough to manage different Ruby versions
without overlapping with anything that Bundler does. So unlike RVM
`rbenv` doesn't create a separate gemset for each project, it installs
gems in the correct Ruby version and lets bundler take care of selecting
the correct version of each gem at runtime. This means it's critical to
run `ruby` and other executables with `bundle exec`. Alternatively you
can have Bundler generate *binstubs* for each executable in your
project's `bin` directory with:

    $ bundle install --binstubs

Binstubs are just wrappers around the real executable and in this case
they will ensure that Bundler is loaded before invoking the wrapped
executable, just like `bundle exec` does.

###Switching to rbenv

`rbenv` doesn't play nicely with RVM so if you are an RVM user as I was
you'll need to completely remove it from your computer:

    $ rvm implode

You'll also need to remove all references to RVM in your `.bashrc` or
`.zshrc` etc.

On OSX you can install `rbenv` with Homebrew, after opening a fresh
shell:

    $ brew update
    $ brew install rbenv

Now hook `rbenv init` into your shell initialisation, e.g.

    $ echo 'eval "$(rbenv init -)"' >> ~/.zlogin

You'll also need to install `ruby-build` in order to install new Ruby
versions:

    $ brew install ruby-build

Then you can install whatever Ruby versions you need, e.g.:

    $ rbenv install 2.3.0

##References

* http://patshaughnessy.net/2011/9/24/how-does-bundler-bundle
* http://kerdany.wordpress.com/2013/11/23/how-does-bundler-do-its-magic/
* https://github.com/sstephenson/rbenv/wiki/understanding-binstubs
* https://github.com/rbenv/rbenv#understanding-shims
* http://bundler.io/
