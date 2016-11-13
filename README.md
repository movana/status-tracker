# status-tracker
==================

## Prerequisites
1. Install [node and npm](http://www.nodejs.org)
2. Install **Grunt** running `npm install -g grunt-cli`
5. `npm install` in project root directory

## Run the app
* Make sure you're done with the prerequisites
* Open a new shell window and navigate to the project root.
* Run `node server.js`
* [http://localhost:8080/] (http://localhost:8080/)

## Development
* Run `node server.js` to start a static web server and open [http://localhost:8080/] (http://localhost:8080/) in your browser. This will start the application.
* Run `grunt watch` to start development. This will watch for changes in your less and js files and trigger a build to compile these into the files that index.html uses to run the show.

## Switching between JSON files
* To switch between which JSON file is being served, open 'app/js/status-controller.js' file. Look for the 'getProgressData();'' function and pass in a 2, 3, or 4 to serve the different versions of test.json. Pass nothing to get the default test.json file.

