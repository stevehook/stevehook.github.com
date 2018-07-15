---
title: "Rails Date and time handling best practice summary"
layout: post
---

A quick reminder of the recommended way to manage date-time values in a
Rails application. Unless you, your servers and all your users live in
a time zone that always tracks UTC this concerns you.

## TL;DR

To get the current time, don't use `Time.now` or `DateTime.now`, use
this instead:

    Time.zone.now

To get a fixed time, don't use `Time.new()` etc., use:

    Time.zone.local(2018, 7, 3, 7, 25, 0)

## Why we have to deal with time zones and adjustments
Typically we have to deal with 3 different time zones in a Web
application:

    * UTC (Universal coordinated time) sometimes referred to as GMT
    (Greenwich meantime) is the neutral time zone in which date-time
    values are stored in your database.
    * System time is the time zone where your server is running.
    * Application time the time zone where your users are. (Lets ignore
    the possibility that you have multiple users in different time zones
    for now).

In Rails you can configure application time zone using `Rails.config.time_zone`
to set the system wide default or `Time.zone` to set the time zone for a
request.

Typically our application needs to work with application time in order
to give users the right information. For example, if you want your
application to display a welcome message "Happy #{day_of_week}"
then you can't use system time, you might end up wishing a user 'Happy
Monday' on Sunday night - nobody likes to have their weekend cut short.

## DateTime and Time - why do we need both?
For historical reasons we've ended up with two classes that do much the
same thing in Ruby, `DateTime` and `Time` both represent a date-time
value. In modern Ruby versions the differences are largely academic,
they have much the same API. As well as a pure date-time value they both
encapsulate a time zone.

The problem with both `DateTime` and `Time` is that they don't know
anything about your application time zone. This is why, for example,
`Time.now` returns the current system time.

## ActiveSupport::TimeWithZone
Rails (ActiveSupport) introduced `ActiveSupport::TimeWithZone` to
provide a new date-time class that is aware of application time zone.

    irb> Time.zone.now.class
    => ActiveSupport::TimeWithZone

    irb> Time.zone.now
    => Tue, 03 Jul 2018 17:24:23 BST +01:00

As you can see `Time.zone.now` returns an `ActiveSupport::TimeWithZone`
object. I'm in London and it's summer time so, thanks to daylight
savings, my UTC offset is `+01:00`.

I can now use this value for the current users time and safely
manipulate it or display it to the user.

If I were to use `Time.now` with system time set to, say, `EST` then I'd
be six hours off:

    irb> Time.now
    => Tue, 03 Jul 2018 11:34:16 EST -05:00

## Multiple user time zones
You should probably be planning for multiple user time zones, in which
case you will need to know which time zone each user is in. There are a
couple of ways to do this, you can use JavaScript to interrogate the
browser settings (assuming these are correct) and send that to the
server. Alternatively you can prompt the user for their time zone when
they sign up to your service (assuming they are required to log in to
use it). I won't go in to any more details about obtaining the user's
time zone here.

Whichever technique you use you will have to set the application
time zone on a per request basis so that each request is configured
correctly. You can do this using `Time.use_zone`, which sets
`Time.zone` which is backed by thread local storage (so that the
time zone selection applies to that particular request only). For
example, assuming your users do have to authenticate and that the `User`
model used to authenticate them has a `time_zone` attribute you can
implement a simple filter in your base controller, e.g.:

    around_action :set_user_time_zone, if: :current_user

    def set_user_time_zone(&block)
      Time.use_zone(current_user.time_zone, &block)
    end

This will cover any time related logic in your HTTP requests but you'll
need to do a little more work for code outside the scope of a controller
action. For example, if you have a background worker that sends an email
to a user you'll want to set application time to be the recipients time zone.

## Client-side
If your application is serving date-time values through an API (rather
than just rendering HTML to the end user) you'll need to think about how
you deliver those values to the client-side, whether it's a JavaScript
single-page application or mobile app.
