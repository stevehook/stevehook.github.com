---
title: "Find and replace in Vim"
layout: post
---

Finding and replacing a given string is a pretty basic text editing
feature. Vim fulfils this requirement more than adequately but there are
a few tricks to learn and remember.

##Working in the current buffer
If you are only concerned with a single file in the current buffer then
things are fairly straightforward. There are a couple of ways that you
can tackle the problem.

###The substitute command
You can use the substitute command (or `:s` for short) to replace one
string (or regex) with a different string:

    :s/foo/bar/

replaces `foo` with `bar` but only operates on the current line and only
on the first occurrence of `foo` so if you want to replace every
occurrence of `foo` what you probably want is:

    :%s/foo/bar/g

`%` effectively means all lines and the `g` modifier means operate on
each occurrence in the given line.

Other useful modifiers are `c` for confirmation and `i` for
case-insensitive matching, e.g.

    :%s/foo/bar/gci

A common requirement is to replace the word under the cursor. To achieve
this you can take advantage of the default search expression being the
last search expression to avoid retyping, so if you already have the
cursor over the word `foo` hit the `*` key then:

    :%s//bar/g

###Change and repeat
If you don't want to drop into command mode, you can change the first
occurrence of the search string, change it manually and then repeat the
change. So for example, `/foo` finds the first `foo`, `ciw` lets you
replace it and then `n.` repeats the change on the next match.

You can repeat the change with a single `.` if you use `cgn` to replace
the next match in one hit (`gn` finds and selects the next match).

##Working across multiple files
I find it a bit more tricky to remember how to find and replace across
multiple files. Having to change the name of a class or method across an
entire project can make you wish you were working in a big IDE and a
statically-typed language.

Vim doesn't have a built-in project-wide find and replace function but
it does have some more flexible tools that make the job simple enough
once you know the tricks. The key tool is the arglist combined with the
`argdo` command. The arglist is a list of files that you can populate
and `argdo` will run a command across all of them.

So if you need to populate the arglist with all you JavaScript files:

    :args **/*.js

and then replace `foo` with `bar` in each of them:

    :argdo %s/foo/bar/gce

The `e` option ignores errors, such as not finding a match in a given
file. I'm using the `c` option so that I can confirm each change
manually in this example.

Finally you'll need to save those files:

    :argdo w

This approach works but is a bit of a sledgehammer because we are
processing every file that *may* contain the search string. There is an
excellent
[VimCast](http://vimcasts.org/episodes/project-wide-find-and-replace/)
discussing a more refined approach and ways in which this may get a
little smarter in future versions of Vim.
