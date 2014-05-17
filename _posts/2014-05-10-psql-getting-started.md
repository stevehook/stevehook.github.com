---
title: "Getting started with psql"
layout: post
---

Postgresql is my preferred relational database. As developers we often
need to poke around in our local database to read or write some data, or
to work out what our code just did (wrong). Rather than reach for a GUI
application like PGAdmin I much prefer to just spin up a command line
interface that I can start throwing SQL statements at.

psql is that tool and after some initial confusion it turns out to be
pretty easy to work with.

##Starting it up

To login to the `sales` database as user `alice` without a password:

    $ psql -d sales -U alice

To login to the `sales` database:

    $ psql -d sales


##Quitting

So you started psql but you want to get out, you try `exit`, `quit` and
find that you are still stuck at the psql prompt. What you need is the
`\q` meta-command.

    psql> \q

##Getting help

Next we need to work out how to get help.

Meta-commands as opposed to a SQL command are prefixed with a backslash.
There is a (meta-)meta-command to list available meta-commands:

    psql> \?

If you want to get help on SQL command, e.g. `ALTER TABLE`:

    psql> \h alter table

or just list all SQL commands:

    psql> \h

##Basic schema commands

Its worth taking a very quick tour of the meta-commands for finding your
way around the database schema:

###Listing databases

    psql> \list

If you need to switch to a different database you need to establish a
new connection (there is no `use <database-name>`).

    psql> \c <database-name>

###Listing tables

    psql> \dt

or including other objects (e.g. sequences):

    psql> \d

###Listing table columns

    psql> \d <table-name>

for more detail:

    psql> \d+ <table-name>

This is just a small sample of the schema meta-commands, to see the
rest remember that `\?` gives you a list.

##Other Useful commands

###Edit the last command

If you want to make a small change to a previous SQL command you don't need
to type it all out again. `\e` will open the last command in your
default editor:

    psql> \e

Note that if the command you edit finishes with a semi-colon it will be
run immediately. Remove the semi-colon if you want to just prepare a
statement for execution.

###History

    psql> \s

Prints the history to the screen. `\s filename` will write it to a file.
Note that this doesn't work on some builds on OSX.

###Editing a command in history

Cycle through the history, e.g. with up arrow, then hit `\e`.

###Clearing the query (input) buffer

`\r` will clear the buffer if you get part way through typing a command
and want to start again, e.g.

    psql> SELECT * FROM\r

