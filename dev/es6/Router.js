var Router = (function() {
	var routes = {};
	var defaultRoute;

	function getActionForRoute(path) {
		var keys = Object.keys(routes);
		for(let i = 0, length = keys.length; i < length; i++){
			let key = keys[i];
			var exp = new RegExp(key, "gi");
			if(!!path.match(exp) && path.match(exp).length == 1) {
				return {action: routes[key], key: key};
			}
		}
		return null;
	}

	function getParams(key, path) {
		let paramsExp = new RegExp(key);
		
		var params = path.match(paramsExp);
		if(params.length > 1) {
			params = params.slice(1);
			params = [path].concat(params);
		} else {
			params = [path];
		}
		return params;
	}

	function registerHTML5Handler() {
		window.onpopstate = function() {
			var route = window.location.pathname.slice(1);
			var action = getActionForRoute(route);
			if(!!action) {
				var params = getParams(action.key, route);
				action.action.apply(undefined, params);
				return;
			} else {
				if(!!defaultRoute) {
					defaultRoute(route);
					event.stopPropagation();
					event.preventDefault();
				} else {
					throw Error("No route was matched and. Default route is not defined.")
				}
			}
		}

		document.body.addEventListener("click", function(event) {
			var element = event.target;
			while(true) { 
				if(element == document.body) {
					break;
				}
				if(!!element.getAttribute("data-route")) {
					var route = element.getAttribute("href");
					
					var action = getActionForRoute(route);
					if(!!action) {
						var params = getParams(action.key, route);
						history.pushState(undefined, "", "/" + route);
						action.action.apply(undefined, params);
						event.stopPropagation();
						event.preventDefault();
						return;
					} else {
						if(!!defaultRoute) {
							history.pushState(undefined, "", "/" + route);
							defaultRoute(route);
							event.stopPropagation();
							event.preventDefault();
							return;
						} else {
							event.stopPropagation();
							event.preventDefault();
							throw Error("No route was matched and. Default route is not defined.")
						}
					}

				} else { 
					element = element.parentElement;
				}
			}
		})

		var path = window.location.pathname.slice(1);
		if(routes[path] != undefined) {
			routes[path]();
		}
	}


	function parseRoute(route) {
		route = route.replace(new RegExp("\{\{[^.]*\}\}", "gi"), function() { 
			if(arguments[0].indexOf(":") > 0) {
				return "([" + arguments[0].slice(2, arguments[0].length - 2).split(":")[0] + "]+)"
			} else {
				return "[" + arguments[0].slice(2, arguments[0].length - 2) + "]+"
			}
		});
		route = route.replace(new RegExp("\{[^/]*\}", "gi"), function() { return "([^/]+)"}); 
		route += "\/?";
		return route;
	}

	return {
		init: function() {
			registerHTML5Handler();
		},
		addRoute: function(route, callback) {
			if(arguments.length < 0) { throw Error("Insufficient number of arguments in addRoute"); }
			route = route.replace(new RegExp("\{\{[^.]*\}\}", "gi"), function() { 
				if(arguments[0].indexOf(":") > 0) {
					return "([" + arguments[0].slice(2, arguments[0].length - 2).split(":")[0] + "]+)"
				} else {
					return "[" + arguments[0].slice(2, arguments[0].length - 2) + "]+"
				}
			});
			route = route.replace(new RegExp("\{[^/]*\}", "gi"), function() { return "([^/]+)"}); 
			route += "\/?"
			routes[route] = callback;
		},
		addDefaultRoute: function(callback) {
			defaultRoute = callback;
		},
		getActionForRoute: getActionForRoute,
		getParams: getParams,
		parseRoute: parseRoute
	} 
})(); 

// history.pushState(undefined, "", "/d")
// window.onpopstate = function() { console.log("blob") }

module.exports = Router;