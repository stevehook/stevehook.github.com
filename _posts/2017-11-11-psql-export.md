---
title: "Using psql to export CSV files"
layout: post
---

## COPY and \copy

The PostgreSQL `COPY` command writes data to a server-side file. The
`psql` `\copy` meta-command does the same thing but lets you write to
the client machine (where you are running `psql`) which tends to be more
useful.

### Export to CSV

The `\copy` meta-command can dump the results of a query to a file:

    \copy (SELECT * FROM users LIMIT 10) to 'tmp/users.txt'

If you want the contents of a whole table there is a shortcut:

    \copy users to 'tmp/users.txt'

To control the format use the `with` option, e.g.:

    \copy (SELECT * FROM users LIMIT 10) to 'tmp/users.txt' with CSV

And if you want the column names as headings:

    \copy (SELECT * FROM users LIMIT 10) to 'tmp/users.txt' with CSV HEADER


