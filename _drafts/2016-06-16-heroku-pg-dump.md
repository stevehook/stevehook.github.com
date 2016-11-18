---
title: "Copying partial databases with Heroku Postgres"
layout: post
---

Heroku Postgres has a backup facility that makes it really easy to
manage database backups and move whole databases from one application to
another or to your local development environment. Because the Heroku
tooling also lets you access the standard Postgres tools you can do some
more complicated tasks without too much trouble.

##pg:backups

Heroku's `pg:backups` command deals with whole databases and stores them
on Amazon S3, making them available to any Heroku application as well as
allowing you to download them locally.

`pg:backups` uses the regular `pg_dump` and `pg_restore` utilities behind the scenes.

##Getting a dump of specific tables in a Heroku Postgres database using `pg_dump`

If you want to do something non-standard with your database using
`pg_dump` then the first thing you need to do is get the credentials and
connection details for your database.

    $ heroku pg:credentials <database-name> --app <app-name>

This command will return the connection string for your database, here
is a made up example:

    postgres://my-username:my-password@ec2-12-34-56-789.compute-1.amazonaws.com:5432/database-name

In a real example `my-username`, `my-password` and `database-name` will
all be seemingly random strings. In this example
`ec2-12-34-56-789.compute-1.amazonaws.com` is the host name of the AWS
EC2 instance on which the database is running. You'll need all of these
details to connect `pg_dump` to the remote database.

    $ pg_dump --no-acl --no-owner -h ec2-12-34-56-789.compute-1.amazonaws.com --dbname=database-name --table=orders --table=order_items --data-only --user=my-username > orders.dump

This command will prompt you for the password and then dump the contents
of the `orders` and `order_items` tables to a file called `orders.dump`.

So now you have a copy of your `orders` and `order_items` tables from
your Heroku Postgres database, suppose you want to copy them to a
different Heroku Postgres database.

You can empty the tables in the target database using the `TRUNCATE`
command via `heroku pg:psql`:

    $ heroku pg:psql --app target-app-name
    psql> truncate orders;
    psql> truncate order_items;

Then to copy the data from the dump that you created earlier:

    $ heroku pg:psql --app target-app-name < orders.dump

