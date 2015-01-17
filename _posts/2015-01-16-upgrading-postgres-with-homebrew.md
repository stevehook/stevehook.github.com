---
title: "Upgrading PostgreSQL with Homebrew"
layout: post
---

Updating Postgres isn't a simple `brew upgrade postgresql` if you want
to keep your data. Here are the steps I took to go from 9.3 to 9.4 based
on [http://www.postgresql.org/docs/9.4/static/upgrading.html](http://www.postgresql.org/docs/9.4/static/upgrading.html).

-------------------------

First backup your data with `pg_dumpall`:

    $ mkdir ~/backups && pg_dumpall -h 127.0.0.1 > ~/backups/postgres.sql

Shut down 9.3:

    $ pg_ctl -D /usr/local/var/postgres stop -s -m fast

Move the old data files out of the way (you can delete them later when
everything is back up and working):

    $ mv /usr/local/var/postgres /usr/local/var/postgres.old

Uninstall 9.3:

    $ brew uninstall postgresql

Now install 9.4 and verify that it worked:

    $ brew update
    $ brew upgrade postgresql
    $ psql --version
    psql (PostgreSQL) 9.4.0

Start 9.4:

    $ pg_ctl -D /usr/local/var/postgres start

Restore your databases:

    $ psql -d postgres < ~/backups/postgres.sql
