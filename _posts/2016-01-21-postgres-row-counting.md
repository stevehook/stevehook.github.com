---
title: "Postgresql row counting"
layout: post
---

Quick reminder about queries to count rows across all tables in a
database.

## Counting rows

If you have a big database and you quickly need to find out how many
rows are in each table you don't really want to be running `SELECT
count(*) FROM <tablename>` for each table.

So if you want a report of the row counts for each table in your database:

    SELECT schemaname, relname, n_live_tup
      FROM pg_stat_user_tables
      ORDER BY n_live_tup DESC;

If you want the grand total:

    SELECT sum(n_live_tup)
      FROM pg_stat_user_tables;

## Put these queries in your .psqlrc

If like me you don't do this often enough to remember these queries add
them to your `.psqlrc` as variables:

    \set show_all_row_counts 'SELECT sum(n_live_tup) FROM pg_stat_user_tables;'

In order to execute a query like this you just need to prefix the
variable name with `:`, e.g.

    :show_all_row_counts
