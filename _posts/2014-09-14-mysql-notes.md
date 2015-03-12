---
title: "MySQL command line notes"
layout: post
---

My preferred RDBMS is PostgreSQL these days but for some projects I
still need to use MySQL. I prefer to use the command line interface for
simple ad-hoc queries and updates. I don't feel quite so at home using
the `mysql` CLI as `psql` but once you find your way around and tweak it
a little its usable enough.

##Connecting to the MySQL CLI:

    $ mysql --user=<username> --password=<password> database_name
    mysql>

##Quit

    mysql> \q
    Bye
    $

##Useful commands

###Edit statements

If you want to edit the most recent statement in your default text
editor you can use `\e`:

    mysql> SELECT * FROM ordrs;
    ERROR 1146 (42S02): Table 'ordrs' doesn't exist
    mysql> \e

###Outputting to a file

The `tee` command lets you copy all output to a file. `notee` to switch
it off again:

    mysql> tee tmp/foo.txt
    Logging to file 'tmp/foo.txt'
    mysql> notee
    Outfile disabled.

###Reverse search

Ctrl-r can be configured to work the same way it does in the
shell to let you retrieve previous commands if you add the following to
your `~/.editrc`:

    bind "^R" em-inc-search-prev

##Configuring the CLI

There are many settings that you can use to customise the CLI. You can
set many of these options at the command prompt on a per session basis.
For example, you can customise your prompt to display the name of the
current database:

    mysql> prompt \d>

Another useful setting is the `pager` to help you scroll through bigger
result sets. You can use common Unix paging programs like `less` or
`more`:

    mysql> pager more

To set up a default configuration you'll need to put your preferences
into a `~/.my.cnf` file. e.g.

    [mysql]
    prompt=\d>
    pager=more


See http://dev.mysql.com/doc/refman/5.7/en/mysql-command-options.html
and http://dev.mysql.com/doc/refman/5.7/en/option-files.html

###Command reference

http://dev.mysql.com/doc/refman/5.7/en/mysql-commands.html

##Data dictionary

To see a list of tables in the current database:

    mysql> show tables;

or to filter by name:

    mysql> show tables like '%tax%';

And then to drill down into the schema for an individual table:

    mysql> describe <mytable>;

Check the indexes on a given table:

    mysql> show indexes in <mytable>;

Which database am I in?:

    mysql> select database();

Which databases are available?:

    mysql> show databases;

Change database:

    mysql> use <db-name>;


##DBA

###Where are my data files?

If you need to find your datafiles then use:

    $ mysql -e 'SHOW VARIABLES WHERE Variable_Name LIKE "%dir"'

    +---------------------------+------------------------------------------------------+
    | Variable_name             | Value                                                |
    +---------------------------+------------------------------------------------------+
    | basedir                   | /usr/local/Cellar/mysql/5.6.15                       |
    | character_sets_dir        | /usr/local/Cellar/mysql/5.6.15/share/mysql/charsets/ |
    | datadir                   | /usr/local/var/mysql/                                |
    | innodb_data_home_dir      |                                                      |
    | innodb_log_group_home_dir | ./                                                   |
    | lc_messages_dir           | /usr/local/Cellar/mysql/5.6.15/share/mysql/          |
    | plugin_dir                | /usr/local/Cellar/mysql/5.6.15/lib/plugin/           |
    | slave_load_tmpdir         | /var/folders/pl/8w9lz0_537n2st2rcq95q24m0000gn/T/    |
    | tmpdir                    | /var/folders/pl/8w9lz0_537n2st2rcq95q24m0000gn/T/    |
    +---------------------------+------------------------------------------------------+

###Backing up databases

If you just want to backup a single database:

    $ mysqldump --user=myuser --password=mypassword dbname > tmp/dev.dmp

Backups are just SQL script text files so to restore a backup just use the `mysql` program:

    $ mysql --user=myuser --password=mypassword dbname < tmp/dev.dmp

If you want to take a backup of all your local databases `mysqldump` has
an `all-databases` option:

    $ mysqldump -u root -ptmppassword --all-databases > /tmp/all-database.sql

