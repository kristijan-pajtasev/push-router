# spa-router
Client side router for Single Page Application (SPA)

Router uses history API so even tho it is client side
router (doesn't do page reload) doesn't use hashes (#)
but slashes(/).

This project is working but it is still in development.
When it becames stable version will changed to 1. 

If you are using this router and notice anything to be 
improved please do send feedback to kristijan.pajtasev@hotmail.com
 with subject push-router.

## Instalation

### CLI

```
npm install push-router
```

### package.json

```
"push-router": "x.y.z"
```

## Example
There is example in example folder. It uses node and ExpressJS.
To start it set position in terminal inside example folder.
To install dependencies run:
```
npm install
```
To start it run:
```
node server/server.js
```

## Usage

### Getting module

```
var Router = require("push-router");
```

### Adding route

```
Router.addRoute(route, callback)
```

### Adding default route

```
Router.addDefaultRoute(callback)
```

### Start listening for route changes

```
Router.init()
```

### Before route changed action
To execute some action in between routes (etc sending for analytics) you can use
addBeforeRouteChanged method. In it as a parameters you will receive previous route and next route.

```
Router.addBeforeRouteChanged(function(){})
```

### Changing route
Changing route works by clicking on a element with attribute data-route="route". Router
will catch click and execute for route defined in href.
```
<a data-route="route" href="test">test</a>
```

### Query
Each route can have query and it will be passed as a object and last object in route
callback.
For route test?param=2 arguments in callback will be ["test?param=2", {param: "2"}]

### Route rules

#### Simple route
```
Router.addRoute("test",function() {}); matches maysite.com/test
```

#### Regex route
```
Router.addRoute("test/{{\\d+}}",function() {}); matches maysite.com/test/1
```

#### Parameter route
```
Router.addRoute("test/{id}",function() {}); matches maysite.com/test/1, passes
1 as argument in callback ["test/1", "1"]
```
If you want to make that parameter optional just add ? after it
```
Router.addRoute("test/{id}?",function() {}); matches maysite.com/test/1 and maysite.com/test/
```

