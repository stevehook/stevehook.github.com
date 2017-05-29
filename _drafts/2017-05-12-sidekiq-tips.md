---
title: "Sidekiq tips"
layout: post
---

delayed_job just queues jobs in a database table so it's easy to see
what's in the queue. Sidekiq uses Redis and it's a bit more
complicated...

## Clearing the queue

So you've queued a bunch of jobs in your development environment and you
just realised there is a bug in your worker code and you want to clear
the job queue.

To start with you can check the queues...

    pry> Sidekiq::Queue.all
    => [#<Sidekiq::Queue:0x007f8db55d83e8 @name="high", @rname="queue:high">,
       #<Sidekiq::Queue:0x007f8db55d8370 @name="medium", @rname="queue:medium">,
       #<Sidekiq::Queue:0x007f8db55d8320 @name="low", @rname="queue:low">]

Then you can see where the jobs are:

    pry> Sidekiq::Queue.new('high').size
    => 24
    pry> Sidekiq::Queue.new('medium').size
    => 0
    pry> Sidekiq::Queue.new('low').size
    => 0

Next you can start cleaning up:

    pry> Sidekiq::Queue.new('high').clear
    => [0, true]
    pry> Sidekiq::Queue.new('high').size
    => 0

Looks good but sometime later...

    pry> Sidekiq::Queue.new('high').size
    => 33

What happened? Where did those new jobs come from?

Next you need to check the `ScheduledSet` which is where jobs that are
scheduled to get queued at a particular time are stored:

    pry> Sidekiq::ScheduledSet.new.size
    => 1252

So it looks like there are loads of jobs waiting to be transferred to a
queue at some time in the future.

    pry> Sidekiq::ScheduledSet.new.clear
    => 0
    pry> Sidekiq::ScheduledSet.new.size
    => 0

So that's better but still you are getting more jobs being queued:

    pry> Sidekiq::Queue.new('high').clear
    => [0, true]
    ...
    pry> Sidekiq::Queue.new('high').size
    => 42

Next check the `RetrySet` where all those failed jobs a sitting:

    pry> Sidekiq::RetrySet.new.size
    => 432
    pry> Sidekiq::RetrySet.new.clear
    => 0

Finally you have an empty queue.
