---
title: "Switching to rbenv - with a quick recap of gems and bundler"
layout: post
---

##Some background

###Gems

###Bundler

Bundler manages gem dependencies for us. For each project we can create
a Gemfile to declare what our project needs, including rules about the
versions we need. Bundler then helps:

    * Install gem dependencies - making sure a compatible set of version
        is available to your application.
    * Ensure that the right gems are loaded at runtime.

##References
    * http://patshaughnessy.net/2011/9/24/how-does-bundler-bundle
    * http://kerdany.wordpress.com/2013/11/23/how-does-bundler-do-its-magic/
    * https://github.com/sstephenson/rbenv/wiki/Understanding-binstubs
