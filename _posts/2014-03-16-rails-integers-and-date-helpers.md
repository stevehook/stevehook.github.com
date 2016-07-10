---
title: "Dates and Integers in Active Support"
layout: post
---

## A quick experiment

Active Support monkey-patches lots of very useful helper methods into
some basic Ruby types, like the date handling helpers that get mixed
into Integers. Open up a Rails console and try something like this:

    > one_month = 1.month
     => 1 month
    > one_month.class
     => Fixnum
    > one_month.to_i
     => 2592000
    > one_month.to_i / 3600 / 24
     => 30

...so it looks like the `month` method returns a `Fixnum` representing the
number of seconds in a 30 day month. So far so good.

    > thirty_days = 30.days
     => 30 days
    > thirty_days.to_i
     => 2592000
    > thirty_days.to_i / 3600 / 24
     => 30

Now try:

    > first_of_march = Date.new(2014, 3, 1)
     => Sat, 01 Mar 2014
    > first_of_march - 30.days
     => Thu, 30 Jan 2014

Subtract 30 days from the 01/03/2014 and you get 30/01/2014 which makes
sense because there are only 28 days in February.

Now try:

    > first_of_march - 1.month
     => Sat, 01 Feb 2014

OK so now this is confusing. Active Support is doing the right thing here
logically, subtract a whole month from a given date and you expect to be
on the same day of the previous month. But we know that `1.month` is
just a `Fixnum` representing 30 days so what is going on here?

## When is an integer more than just an integer?

To understand what is happening here you can dig into the Rails source
code. It's not too hard to do once you understand the high-level
structure (e.g. the extensions to core Ruby classes are mostly found in
the Active Support gem).

So if look at the implementation of `Integer#month` it starts to become
a little clearer:

    def months
      ActiveSupport::Duration.new(self * 30.days, [[:months, self]])
    end
    alias :month :months

So it doesn't really return a `Fixnum` after all. It's really an
`ActiveSupport::Duration`. Now this class stores a `value` attribute
(the `Fixnum`) and overrides `method_missing` delegating everything it
doesn't implement to `value` which is why it reports its `class` as
`Fixnum`

    def method_missing(method, *args, &block) #:nodoc:
      value.send(method, *args, &block)
    end

`ActiveSupport::Duration` also has a `parts` attribute that stores the
`[[:months, 1]]` in our case so it contains the additionally
information, over and above the `value`, needed to perform logically
correct date arithmetic. This gets applied in the extensions to the
`Date` class that deal with date arithmetic. Check
[the source](https://github.com/rails/rails/blob/9abe72c7600132aa964ca48c312ef981007ab8b1/activesupport/lib/active_support/core_ext/date/calculations.rb#L98)
if you want to follow the trail further.

So it just works.

## Is this a good thing?

There is a lot of magic in Rails like this and it can be controversial.
On the whole it does the right thing and it obeys the principle of least
surprise. So most of the Rails magic is a good thing because its pretty
well judged. Many equally 'clever' features that are perhaps not quite
so generally applicable don't appear in the framework. You'll have to
make your own mind up, if this is too much magic for you there is always
Sinatra.



