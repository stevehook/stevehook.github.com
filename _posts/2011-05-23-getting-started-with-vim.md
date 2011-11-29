---
title: "Getting started with Vim"
layout: default
---

**Why Vim?**

My first experience of vi was on an ancient VAX/VMS machine at college. From what little I remember it was an uncomfortable experience that I never expected to revisit.

A few weeks ago though I found myself installing Vim on my Mac and PC. Why would anybody do that in this day and age?

During my day job I mostly work with C# in Visual Studio but for Ruby and JavaScript programming I prefer something more lightweight. TextMate is a great editor but there are a couple of problems with it, firstly its not been updated for several years. Thats not a huge problem because its just fine at what it does. The second problem is that there is nothing quite like it on Windows, although there are one or two that are close like the e text editor.

So switching between one editor for work and another at home was always a pain - and its hard enough to learn one editor well.  So I took a look at Vim, partly because it seems to be increasingly popular in the Ruby community these days and has a reputation for being incredibly productive (if you ever manage to master it).


**Is it hard?**

Yes. Unfortunately there is no getting away from this, but it is worth it if you can stick with it.

Getting started is the hardest part because simple tasks that you may take for granted, like cutting and pasting are not at all intuitive (if you have a background like mine at least).

What does make it easier is that there is a large and helpful community using VIM and there a number of great resources to get you going. These are my favourites so far:

* vimtutor - just run this from the command line and follow the instructions. It covers some of the basics and forces you to learn by doing.
* Vim cheat sheet
* Vimcasts
* Peepcode's Smash into Vim screencasts

**Getting through the first few weeks**

At first Vim is a throughly disorienting experience so the challenge is getting over that very steep initial learning curve, and remaining productive. This is partly about learning the keystrokes but also involves customising the editor in various ways to make day-to-day tasks achievable. These are the tricks, plugins and tweaks that I found helpful along the way:

* Get a plugin to help you navigate the file system. NERDTree works well for me, its reasonably easy to get started because you don't need to learn very many new commands - because its a regular Vim buffer the regular movement commands apply. Just remember 'm' to bring up the menu if you need to add, delete or rename a file.
* Set up comfortable key mappings for commands that you use regularly. For example, the esc key is a little too far away from the keyboard's home row so some Vim users map jj to esc, so that they can exit insert mode efficiently.
* Put your Vim configuration under source control with Git. You are likely to be making a lot of changes and it makes sense to track those changes as well as push them to a server and clone them onto new machines.
* Learn how to work with multiple buffers. When you have multiple files open. Its tempting to use multiple tabs for working with multiple files but this is really not very efficient in Vim, for example NERDTree works in a single tab. This is one area where I'm still trying to work out the most efficient way to work.
* 


**Some lessons learnt**

I have reached the point where I am comfortable using Vim for all of my Ruby and JavaScript programming, though I feel as though I could be a lot more productive, with practice and learning some more tricks as well as automating a few more common tasks with key mappings or by learning a few more plugins.

* I had to try really hard to stop yourself using those arrow keys but this does seem to pay off after a while.
* Its necessary to relearn a number of tricks that you have taken for granted in other editors. These may not be intuitive so you might need to do a few searches or install a plugin. In most cases the answer is only a quick Google search away.
* I have started to miss Vim commands in other editors and applications. So much so that I have installed the excellent VsVim plugin for Visual Studio. 

