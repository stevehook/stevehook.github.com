---
title: "Finding my way around Docker"
layout: post
---

These days we developers are forever hearing about the merits of Docker.
If you are happily running your development environment on host machine
what does Docker offer and what does it all mean?

## What is it for?

One use case is to provide a consistent runtime environment in which to
develop and test a system.

The idea of running your development environment in a virtual machine to
promote consistency is not a new idea. All the developers on the team
can share exactly the same setup without having to worry about what we
all install on our development machine. The downside is that virtual
machines are big and cumbersome, each one taking gigabytes of disk space
and lots of memory and CPU at runtime. Docker is different because it
uses the same OS kernel and file-system as the host machine, so a Docker
container is lightweight enough to have several of them setup or running
on your development machine. It's a little more complicated if your
development machine doesn't run Linux but you still get the same
benefits.

Of course Docker has other use cases for CI and production servers but
I'm not going to try to explain those here.

## Docker concepts

### Images, Containers and Dockerfiles

An image is the term for a saved Docker file-system and configuration. A
container is an instance of a running image. An image/container can be
as simple or as complex as you like, though typically they are small
and single-purposed, e.g. a Web server and database are likely to be
running in separate containers.

A `Dockerfile` is a recipe for an image. It defines the software that will
be installed in an image and the configuration of that image (e.g. the
ports that it exposes).

## Installing Docker

I use a Mac for development. Docker doesn't run *natively* on OS X you
need a VM to run. On a Mac Docker runs inside an Ubuntu VM running on
Oracle VirtualBox. So does that mean that you lose all the benefits that
we listed above? No because the VM itself, that you need to run Docker
is pretty small and it can run multiple containers so you only need one
instance of it. Furthermore the Docker Toolbox now automates the
management of this VM so from a developer point of view it's pretty much
invisible.

Getting set up is as simple as downloading and running the Docker
Toolbox from https://www.docker.com/products/docker-toolbox

## Creating a Dockerfile

It is possible to create a Docker image and run a container to run your
application from scratch using the `docker` command but normally the
first step in dockerizing an application is to create a `Dockerfile`.
The `Dockerfile` is normally added to your application's Git repo so
that it can be used by other team members to reproduce the same
development environment.

Dockerfile commands are upper case words followed by a string of
arguments. The first line should always be a `FROM` command, this tells
docker what to use as the base image for your application's image. You
can start from a bare OS, e.g. `FROM ubuntu:16.04` in which case you'll
have a long list of dependencies to install, or you can use a publicly
available base image on Docker Hub that is a little more complete
allowing you to focus on your application specifics. For example, if you
are dockerizing a Rails project the recommending starting point is the
`ruby` image (see https://hub.docker.com/_/rails/). e.g.

     1 FROM ruby:2.3
     3
     4 RUN apt-get update \
     5  && apt-get install -y --no-install-recommends \
     6      postgresql-client \
     7  && rm -rf /var/lib/apt/lists/*
     8
     9 WORKDIR /usr/src/app
    10 COPY Gemfile* ./
    11 RUN bundle install
    12 COPY . .
    13
    14 EXPOSE 3000
    15 CMD ["rails", "server", "-b", "0.0.0.0"]

In this example we are using the `RUN` command to install the
`postgres-client` dependency because our Rails application needs to
connect to a database. You might have other requirements here.

The `WORKDIR` command defines the working directory for your
application, i.e. where the dockerised application will run from.  The
`COPY` command copies the contents of the host folder into that
directory in the container.

The `EXPOSE` command declares ports that the container should expose,
here we are just exposing port 3000 but we could also map a container
port to a different port on the host machine, e.g. `EXPOSE 80:3000`
exposes port 80 from the container as port 3000 on the host machine.

Finally the `CMD` command defines the process that will be run within
the container, in this case a Rails server).

Once you have a Dockerfile you can use `docker` to start your
container, stop it and interact with it.

Start the container:

    $ docker 

Stop the container:

Run an arbitrary command in the container:


There is a lot more to docker itself but we are going to move on because
we are going to be using multiple containers and we'll need something a
little higher level to manage them all.

## docker-compose

You could install everything your application needs into a single
container but that would not be the docker way. Containers should be
single-purposed.

So if you want to run small single-purpose containers they won't be able
to do a whole lot by themselves. You'll need more than one for a
non-trivial application. So if your application is built from a set of
interdependent containers you are going to need something to organise
them. This is where `docker-compose` comes in handy.

`docker-compose` lets you define a list of services in a
`docker-compose.yml` that represent the different moving parts of your
application. For example, you might have a service for your Web
application, another for your background workers, then others for your
Postgres database server, Elasticsearch server and Redis server.

Here is a simpler example with just two services, `web` - a Rails application
and `db` - a Postgres database.

    version: "2"
    services:
      web:
        image: "foo:v1"
        build:
          context: .
          dockerfile: Dockerfile
        ports:
          - "3000:3000"
        command: ["bundle", "exec", "rails", "s", "-p", "3000", "-b", "0.0.0.0"]
        depends_on:
          - db
        environment:
          DATABASE_URL: postgres://db:5432
        tty: true
        stdin_open: true
      db:
        image: "postgres:9.6"
        volumes:
          - ./docker-data/postgresql:/var/lib/postgresql/data
        ports:
          - "5432:5432"

The `db` service is based on a standard image that we are going to pull
from Dockerhub. It creates a volume that we map to a directory in the
host OS because we don't want our database to be re-paved every time we
stop and start the container. The only other thing it does is to expose
the standard Postgres port to the host OS.

The `web` service is built from a custom `Dockerfile` which we have
written for this project. `command` defines the program that the
container runs, it's reason to exist, in this case it's starting the
Rails server. We also declare a dependency on the `db` service and an
environment variable that configures the database connection. The `db`
server's hostname is just `db` inside the `web` container. Finally the
`tty` and `stdin_open` options make it possible for you to interact with
the container through a regular terminal session (see tips below).

Start the containers:

Stop the containers:

Run an arbitrary command in a given container:

## docker-sync

It turns out that for certain kinds of applications (e.g. Rails
applications that use asset pipeline) performance in docker containers
can be poor. In some cases unusably poor. It turns out that docker
volumes are not great when the container OS is performing a lot of reads
and writes. If you hit this problem you may need to drop the volumes and
use file synchronisation. There are various tools that need to be
configured to do this, the `docker-sync` gem helps to wrap these in a
simple tool.

You'll need to declare what you sync and what you don't in a
`docker-sync.yml` configuration file:

    version: "2"

    options:
      verbose: true
    syncs:
      app-sync:
        src: '.'
        sync_strategy: 'native_osx'
        sync_excludes: ['node_modules', 'tmp', '.gitignore', '.git', 'log']

Note that we specifically exclude stuff that we don't need to replicate
because it's not part of the application, like `.git` or stuff that is
large that can be shared via a volume without impacting performance,
like `node_modules`.

The `docker-sync-stack` command then lets you start and stop the
synchronisation services as well as the containers you've declared in
`docker-compose.yml` in a single command:

    $ docker-sync-stack start

`docker-compose` will be running after issuing this command so you can
use commands like `docker-compose exec` as if you had run plain
`docker-compose up`.

To shut everything down again:

    $ docker-sync-stack clean


## Some Tips

### Listing docker processes

After you run `docker-compose` you can still use regular `docker`
commands to interact with your containers. For example:

    $ docker ps
    CONTAINER ID        IMAGE                            COMMAND                  CREATED             STATUS              PORTS
                                NAMES
    3cdb6e06e1cb        foo:v1                           "./bin/rails s -p ..."   2 days ago          Up 8 minutes        0.0.0.0:3000->3000/tcp                           foo_web_1
    6433cd4086d5        elasticsearch:2.4.0              "/docker-entrypoin..."   2 days ago          Up 8 minutes        0.0.0.0:9200->9200/tcp, 0.0.0.0:9300->9300/tcp   foo_elasticsearch_1
    86ec5926d22c        memcached:1.4.37                 "docker-entrypoint..."   2 days ago          Up 8 minutes        0.0.0.0:11211->11211/tcp                         foo_memcached_1
    c384440d63c5        redis:3.2.4                      "docker-entrypoint..."   2 days ago          Up 8 minutes        0.0.0.0:6379->6379/tcp                           foo_redis_1
    c87f6845587d        postgres:9.4.9                   "/docker-entrypoin..."   2 days ago          Up 8 minutes        0.0.0.0:5432->5432/t$p                           foo_db_1

Note that the container ID is based on the docker-compose service name
but also includes a random prefix. You need this in the next tip...

### Attaching to a running container

If you know the name of a container you can run arbitrary commands,
e.g. for a container called `foo_web_1` you can run `bash` as follows
(`-i` and `-t` are required to make the session interactive):

    $ docker exec -it foo_web_1 bash

### Debugging

If you want to use a debugger on an application running inside a
docker container then there are a couple of extra hoops to jump through.

For example, I often stick a `binding.pry` in my Ruby code to debug a
Rails application. This doesn't 'just work' if your Rails application is
running in a Docker container.

First thing you need to do is add the following two lines to your
`docker-compose.yml` file for the service that you want to debug to hook
up the necessary IO:

    web:
      tty: true
      stdin_open: true

This doesn't make your pry debugging session available from
`docker-compose` - that's because `docker-compose` is typically used to
manage multiple services so it doesn't make a lot of sense to expose a
terminal session for one service. But you can then use `docker attach` to
get a terminal session with an individual service, it breaks on
`binding.pry` and allows us to work with pry in a familiar terminal
session. e.g. if you want to attach to the service called `web` in your
`docker-compose.yml`:

    $ docker attach $(docker-compose ps -q web)

(This command has to lookup the docker container name from the
compose service in order to attach to it).

##Conclusion

There is a great deal more to Docker beyond the basics I've talked about
here. By setting up a `Dockerfile` and `docker-compose.yml` you can
containerize your application development environment reasonably easily
(check Dockerhub for examples if you are stuck). This can significantly
reduce the effort needed to configure a development or test environment
for other team members.
