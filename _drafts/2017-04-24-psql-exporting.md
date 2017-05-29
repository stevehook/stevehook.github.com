---
title: "Exporting data from psql"
layout: post
---

psql has some nice extensions to export the results of a query to a file.

## Export to CSV

    psql> \copy (select * from foo) to './tmp/foo.csv' as CSV;
