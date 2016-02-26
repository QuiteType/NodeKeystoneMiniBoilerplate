
=======
NodeKeystoneMiniBoilerplate
===========

Prerequisites
-------------

- [MongoDB](http://www.mongodb.org/downloads)
- [Node.js](http://nodejs.org)
- Command Line Tools
 - <img src="http://deluge-torrent.org/images/apple-logo.gif" height="17">&nbsp;**Mac OS X**: [Xcode](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) (or **OS X 10.9 Mavericks**: `xcode-select --install`)
 - <img src="http://dc942d419843af05523b-ff74ae13537a01be6cfec5927837dcfe.r14.cf1.rackcdn.com/wp-content/uploads/windows-8-50x50.jpg" height="17">&nbsp;**Windows**: [Visual Studio](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-8)
 - <img src="https://lh5.googleusercontent.com/-2YS1ceHWyys/AAAAAAAAAAI/AAAAAAAAAAc/0LCb_tsTvmU/s46-c-k/photo.jpg" height="17">&nbsp;**Ubuntu**: `sudo apt-get install build-essential`
 - <img src="http://i1-news.softpedia-static.com/images/extra/LINUX/small/slw218news1.png" height="17">&nbsp;**Fedora**: `sudo yum groupinstall "Development Tools"`
 - <img src="https://en.opensuse.org/images/b/be/Logo-geeko_head.png" height="17">&nbsp;**OpenSUSE**: `sudo zypper install --type pattern devel_basis`

**Note:** If you are new to Node or Express, I recommend to watch
[Node.js and Express 101](http://www.youtube.com/watch?v=BN0JlMZCtNU)
screencast by Alex Ford that teaches Node and Express from scratch. Alternatively,
here is another great tutorial for complete beginners - [Getting Started With Node.js, Express, MongoDB](http://cwbuecheler.com/web/tutorials/2013/node-express-mongo/).

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files.
3. When it's done installing, run one of the task runners to get going:
	* `gulp` manually compiles files.
	* `gulp watch` automatically compiles files when changes are made and applies changes using [LiveReload](http://livereload.com/).
	* `gulp test` compiles files and runs unit tests.


Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
cd
# SOMETIMES YOU HAVE TO START MONGOD
mongod
mongo dp

# command + t
cd NodeKeystoneMiniBoilerplate

# Install NPM dependencies
sudo npm install
nodemon start

# command + t
gulp && gulp watch

# if it crashes use
killall -9 node && nodemon start

# Wont start? try...
rm -rf node_modules
sudo npm install

# open http://localhost:3000/

```

**Note:** I highly recommend installing [Nodemon](https://github.com/remy/nodemon).
It watches for any changes in your  node.js app and automatically restarts the
server. Once installed, instead of `node app.js` use `nodemon app.js`. It will
save you a lot of time in the long run, because you won't need to manually
restart the server each time you make a small change in code. To install, run
`sudo npm install -g nodemon`.

Dump MongoDB

```
mongodump
```

Edit the database
```
db.fonts.update(
    {},
    { $set: { price: NumberInt(60) } },
    { multi: true }
)
```

Server setup

```
chmod 400 start.pem

ssh -i "start.pem" ubuntu@##.##.###.###
sudo apt-get install git
git init
git remote add origin https://github.com/###/###.git
git pull origin master

#ONLY IF YOU HAVE TO
#Force Git
git fetch --all
git reset --hard origin/master

#restore DB
sudo apt-get install mongodb-clients
sudo apt-get install mongodb-server
mongo start --eval "db.dropDatabase()"
mongorestore

#install npm
#sudo apt-get update
sudo apt-get install npm
sudo apt-get install nodejs-legacy
sudo npm install
# WAIT 4 EVERS... X_X

#set ENV variables 
mv SERVER.env .env

#start the app
sudo npm -g install forever
ps aux | grep forever
sudo npm install
forever start start.js

```
check http://##.##.###.###:3000/

