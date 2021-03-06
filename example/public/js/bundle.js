/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	Router = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Router = (function () {
		var routes = {};
		var defaultRoute;
		var previousRoute = "";
		var beforeAction;

		function getActionForRoute(path) {
			var keys = Object.keys(routes);
			for (var i = 0, _length = keys.length; i < _length; i++) {
				var key = keys[i];
				var exp = new RegExp(key, "gi");
				if (!!path.match(exp) && path.match(exp).length == 1) {
					return { action: routes[key], key: key };
				}
			}
			return null;
		}

		function getParams(key, path) {
			var paramsExp = new RegExp(key);

			var params = path.match(paramsExp);
			if (params.length > 1) {
				if (params[params.length - 1] != undefined) {
					console.log("last is query");
					params[params.length - 1] = parseQuery(params[params.length - 1]);
				} else {
					params = params.slice(0, params.length - 1);
				}
				params = params.slice(1);
				params = [path].concat(params);
			} else {
				params = [path];
			}
			return params;
		}

		function parseQuery(query) {
			query = query.slice(1);
			var values = query.split("&");
			var queryValues = {};
			for (var i = 0, _length = values.length; i < _length; i++) {
				var value = values[i].split("=");
				queryValues[value[0]] = !!value[1] ? value[1] : "";
			}
			return queryValues;
		}

		function registerHTML5Handler() {
			window.onpopstate = function () {
				var route = window.location.pathname.slice(1);
				var action = getActionForRoute(route);
				if (!!action) {
					var params = getParams(action.key, route);
					if (!!beforeAction) {
						beforeAction(previousRoute, route);
					}
					previousRoute = route;
					action.action.apply(undefined, params);
					return;
				} else {
					if (!!defaultRoute) {
						defaultRoute(route);
					} else {
						throw Error("No route was matched and. Default route is not defined.");
					}
				}
			};

			document.body.addEventListener("click", function (event) {
				var element = event.target;
				while (true) {
					if (element == document.body) {
						break;
					}
					if (!!element.getAttribute("data-route")) {
						event.stopPropagation();
						event.preventDefault();

						setRoute(element.getAttribute("href"));
						return;
					} else {
						element = element.parentElement;
					}
				}
			});

			var path = window.location.pathname.slice(1);
			if (routes[path] != undefined) {
				routes[path]();
			}
		}

		function registerHashHandler() {
			window.onhashchange = function () {
				var route = window.location.hash.slice(1);
				var action = getActionForRoute(route);
				if (!!action) {
					var params = getParams(action.key, route);
					if (!!beforeAction) {
						beforeAction(previousRoute, route);
					}
					previousRoute = route;
					action.action.apply(undefined, params);
					return;
				} else {
					if (!!defaultRoute) {
						defaultRoute(route);
					} else {
						throw Error("No route was matched and. Default route is not defined.");
					}
				}
			};

			document.body.addEventListener("click", function (event) {
				var element = event.target;
				while (true) {
					if (element == document.body) {
						break;
					}
					if (!!element.getAttribute("data-route")) {
						event.stopPropagation();
						event.preventDefault();

						setRoute(element.getAttribute("href"));
						return;
					} else {
						element = element.parentElement;
					}
				}
			});

			var path = window.location.pathname.slice(1);
			if (routes[path] != undefined) {
				routes[path]();
			}

		}

		function parseRoute(route) {
			route = route.replace(new RegExp("{{[^.]*}}", "gi"), function () {
				if (arguments[0].indexOf(":") > 0) {
					return "([" + arguments[0].slice(2, arguments[0].length - 2).split(":")[0] + "]+)";
				} else {
					return "[" + arguments[0].slice(2, arguments[0].length - 2) + "]+";
				}
			});
			route = route.replace(new RegExp("/?{[^/]*}", "gi"), function () {
				return "([^/]+)";
			});
			route += "/?";
			return route;
		}

		function setRoute(route) {

			var action = getActionForRoute(route);
			if (!!action) {
				var params = getParams(action.key, route);
				if(!!history) {
					history.pushState(undefined, "", "/" + route);
				} else {
					window.location.hash = "#" + route;
				}
				if (!!beforeAction) {
					beforeAction(previousRoute, route);
				}
				previousRoute = route;
				if(!!history) {
					history.pushState(undefined, "", "/" + route);
				} else {
					window.location.hash = "#" + route;
				}
				action.action.apply(undefined, params);
				return;
			} else {
				if (!!defaultRoute) {
					if(!!history) {
						history.pushState(undefined, "", "/" + route);
					} else {
						window.location.hash = "#" + route;
					}
					if (!!beforeAction) {
						beforeAction(previousRoute, route);
					}
					previousRoute = route;
					defaultRoute(route);
					return;
				} else {
					throw Error("No route was matched and. Default route is not defined.");
				}
			}
		}

		return {
			init: function init() {
				if(!!history) {
					registerHTML5Handler();
				} else {
					registerHashHandler();
				}
			},
			addRoute: function addRoute(route, callback) {
				if (arguments.length < 0) {
					throw Error("Insufficient number of arguments in addRoute");
				}
				route = route.replace(new RegExp("{{[^.]*}}", "gi"), function () {
					if (arguments[0].indexOf(":") > 0) {
						return "([" + arguments[0].slice(2, arguments[0].length - 2).split(":")[0] + "]+)";
					} else {
						return "[" + arguments[0].slice(2, arguments[0].length - 2) + "]+";
					}
				});
				route = route.replace(new RegExp("{[^/]*}", "gi"), function () {
					return "([^/]+)";
				});
				route += "/?(\\?.*)?";
				routes[route] = callback;
			},
			addDefaultRoute: function addDefaultRoute(callback) {
				defaultRoute = callback;
			},
			getActionForRoute: getActionForRoute,
			getParams: getParams,
			parseRoute: parseRoute,
			setRoute: setRoute,
			addBeforeRouteChanged: function addBeforeRouteChanged(callback) {
				beforeAction = callback;
			}
		};
	})();

	// history.pushState(undefined, "", "/d")
	// window.onpopstate = function() { console.log("blob") }

	module.exports = Router;

/***/ }
/******/ ]);