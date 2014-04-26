---
title: "Using Vim as a markdown editor"
layout: post
---

The biggest benefit of using markdown for me is that I can use my
regular text editor for writing documents. On the rare occasions that I
am forced to use them these days Word processors seem clumsy and bloated.

###Basic formatting

When editing markdown files you probably want to have word wrapping on
and you will need to make sure the filetype is set correctly, I have
this in my `.vimrc`:

    function s:setupWrapping()
      set wrap
      set wm=2
      set textwidth=72
    endfunction

    function s:setupMarkdown()
      set ft=markdown
      call s:setupWrapping()
    endfunction

    au BufRead,BufNewFile *.{md,markdown,mdown,mkd,mkdn} call s:setupMarkdown()

I also have (vim-markdown)[https://github.com/plasticboy/vim-markdown]
installed.

To reformat a selection (to tidy up word-wrapping) the `gq` command is handy.

###Spell checking

Its worth getting to know your text editor's spell checker when
you are writing words as well as code. Fortunately Vim has a perfectly
serviceable spell checker:

To switch the spell checker on or off:

    :setlocal spell spelllang=en_gb
    :setlocal nospell

Doing this manually is a bit of a pain so you can set up an autocmd to
switch it on by file type in your `.vimrc`:

    autocmd BufRead,BufNewFile *.md setlocal spell spelllang=en_gb

Operating the spell checker is not quite so intuitive in a text editor
but its not so hard, you just need to remember a few commands:

* `zg` add the word under the cursor to the dictionary.
* `zw` remove the word under the cursor from the dictionary and mark it as wrong.
* `z=` suggest words for the misspelled word under the cursor.
* `:h spell` to list all the other spelling functions.

> Note that there are only two kinds of English, so-called *British*
> English and *mistakes*.

###Preview

You will probably want to check your markdown before pushing it to your
blog or wherever it is going.
Other graphical editors have a fancy markdown preview function but Vim
being character based doesn't have anything built in. There are a
couple of options, you could install a plugin that keeps a preview
window open and refreshes it as you type, like
[vim-instant-markdown](https://github.com/suan/vim-instant-markdown).

What works best for me though is to install a Chrome plugin for
markdown preview, set Chrome to be the default application for `.md`
files and open the current file straight from Vim:

    :!open %




