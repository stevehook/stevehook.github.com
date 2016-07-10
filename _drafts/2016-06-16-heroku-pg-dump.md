---
title: "Copying partial databases with Heroku Postgres"
layout: post
---

Heroku Postgres has a backup facility that makes it really easy to
manage database backups and move whole databases from one application to
another or to your local development environment. Because the Heroku
tooling also lets you access the standard Postgres tools you can do some
more complicated tasks without too much trouble.

## pg:backups

Heroku's `pg:backups` command deals with whole databases and stores them
on Amazon S3, making them available to any Heroku application as well as
allowing you to download them locally.

`pg:backups` uses the regular `pg_dump` and `pg_restore` utilities behind the scenes.

## Getting a dump of a Heroku Postgres database using `pg_dump`

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


h pg:credentials HEROKU_POSTGRESQL_GOLD_URL --app bisley-asset-staging



