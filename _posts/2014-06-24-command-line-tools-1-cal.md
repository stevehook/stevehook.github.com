---
title: "Command line tools - cal"
layout: post
---

Quick post about another thing I no longer need to use the mouse for.

##cal

So now when I can't remember what day the end of the month falls on:

    $ cal
         July 2014
    Su Mo Tu We Th Fr Sa
           1  2  3  4  5
     6  7  8  9 10 11 12
    13 14 15 16 17 18 19
    20 21 22 23 24 25 26
    27 28 29 30 31

or I don't know which day is New Year:

    $ cal 1 2015
        January 2015
    Su Mo Tu We Th Fr Sa
                 1  2  3
     4  5  6  7  8  9 10
    11 12 13 14 15 16 17
    18 19 20 21 22 23 24
    25 26 27 28 29 30 31

or I want to see the bigger plan:

    $ cal -y
                                 2014

          January               February               March
    Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa
              1  2  3  4                     1                     1
     5  6  7  8  9 10 11   2  3  4  5  6  7  8   2  3  4  5  6  7  8
    12 13 14 15 16 17 18   9 10 11 12 13 14 15   9 10 11 12 13 14 15
    19 20 21 22 23 24 25  16 17 18 19 20 21 22  16 17 18 19 20 21 22
    26 27 28 29 30 31     23 24 25 26 27 28     23 24 25 26 27 28 29
                                                30 31
           April                  May                   June
    Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa
           1  2  3  4  5               1  2  3   1  2  3  4  5  6  7
     6  7  8  9 10 11 12   4  5  6  7  8  9 10   8  9 10 11 12 13 14
    13 14 15 16 17 18 19  11 12 13 14 15 16 17  15 16 17 18 19 20 21
    20 21 22 23 24 25 26  18 19 20 21 22 23 24  22 23 24 25 26 27 28
    27 28 29 30           25 26 27 28 29 30 31  29 30

            July                 August              September
    Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa
           1  2  3  4  5                  1  2      1  2  3  4  5  6
     6  7  8  9 10 11 12   3  4  5  6  7  8  9   7  8  9 10 11 12 13
    13 14 15 16 17 18 19  10 11 12 13 14 15 16  14 15 16 17 18 19 20
    20 21 22 23 24 25 26  17 18 19 20 21 22 23  21 22 23 24 25 26 27
    27 28 29 30 31        24 25 26 27 28 29 30  28 29 30
                          31
          October               November              December
    Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa  Su Mo Tu We Th Fr Sa
              1  2  3  4                     1      1  2  3  4  5  6
     5  6  7  8  9 10 11   2  3  4  5  6  7  8   7  8  9 10 11 12 13
    12 13 14 15 16 17 18   9 10 11 12 13 14 15  14 15 16 17 18 19 20
    19 20 21 22 23 24 25  16 17 18 19 20 21 22  21 22 23 24 25 26 27
    26 27 28 29 30 31     23 24 25 26 27 28 29  28 29 30 31
                          30

Now all I need is to highlight days off in red...
