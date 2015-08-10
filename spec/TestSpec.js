describe("A suite", function() {
	var Router = require("../dev/js/Router");
	Router.addRoute("test", function() { });

	it("does't have handler and returns null", function() {
		expect(Router.getActionForRoute("")).toBe(null);
	});

	it("has handler and returns it", function() {
		expect(Router.getActionForRoute("test")).not.toBe(null);
	});

	it("gets only route as params", function() {
		var params = Router.getParams("test", "test");
		expect(params.length).toBe(1);
		expect(params[0]).toBe("test");
	});

	it("gets route and a param", function() {
		var params = Router.getParams(Router.parseRoute("test/{id}"), "test/1");
		expect(params.length).toBe(2);
		expect(params[0]).toBe("test/1");
		expect(params[1]).toBe("1");
	});

	it("gets route and two params", function() {
		var params = Router.getParams(Router.parseRoute("test/{id}/{param2}"), "test/1/2");
		expect(params.length).toBe(3);
		expect(params[0]).toBe("test/1/2");
		expect(params[1]).toBe("1");
		expect(params[2]).toBe("2");
	});
});
/*
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(false);
  });
});
*/