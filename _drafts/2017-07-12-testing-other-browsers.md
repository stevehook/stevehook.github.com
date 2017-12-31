---
title: "Testing Rails applications with other browsers"
layout: post
---

It has been said that:

> MacOS is great for building Web applications, Linux is great for
> running Web applications and Windows is great for testing Internet
> Explorer.

This has been my experience. Occasionally though we need to look at a
particular issue that our IE or mobile browser users are experiencing.

## Testing IE

To be fair to Microsoft this is somewhat easier these days. Install
Virtual Box and then grab a ready-made virtual machine from
https://developer.microsoft.com/en-us/microsoft-edge/tools/vms/

You'll need to get a different VM image for each version of IE that you
want to test and the licences expire after 90 days.

Once you've got the VM up and running there are a couple of things that
you might need to do to connect to your local development Web server
running on MacOS.

Firstly, you can't just point IE at
`http://localhost:3000`, fortunately Virtual Box sets up `10.0.2.2` to
connect to the host OS (where your Rails application is running) so just
open `http://localhost:3000`. If your application does something clever
with domain names, say you need to connect to `myapp.lvh.me` then
you'll need to map this address in your `hostfile` to `10.0.2.2`.

Second thing is that copy and paste between the host OS and
VM is disabled by default, which make entering long URLs painful. To
enable it just need to adjust the settings in Virtual Box for your
VM. Select the VM, then go to Settings > General > Advanced and set
'Shared Clipboard' to 'Host to Guest'.

## Mobile Safari

### With a real iOS device

If you have an iPhone or iPad it's worth testing your application on the
real hardware. Assuming that your iOS device and development Mac are
both on the same network you need to make sure that your development
Rails server is bound to an IP address that the mobile device can see.

One way is to firstly find your development Mac IP address. You can find
this in Network preferences or by running `ifconfig` at the command
line.

You then need to restart your Rails server bound to this address, so if
you have IP address `192.168.0.1` start the Rails server with:

    $ bundle exec rails server -b 192.168.0.1 -p 3000

Then you can point your mobile Safari browser at `http://192.168.0.1`
and you should then see your application.

### With an iOS simulator

If you don't have a physical device for the iOS variant you want to test
then the simulator is the answer. You need to install `xcode` and then
install the iOS Simulator for the version you care about. From that
point you can follow the same procedure as a real device.
