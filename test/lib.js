const expect = require("chai").expect,
	config = require('../index.js'),
	path = require('path');


describe("init", function() {
	it("init from existing file without error", function() {
		let t = ()=> {config.init(path.join(__dirname, 'options.json'));};
		expect(t()).to.not.throw;
	});

	it("throw on fake filename", function() {
		let t = ()=> {config.init(path.join(__dirname, 'optionss.json'));};
		expect(t()).to.throw;
	});

	it("throw on not valid json", function() {
		let t = ()=> {config.init(path.join(__dirname, 'faulty_options.json'));};
		expect(t()).to.throw;
	});
});

describe("reader.get", function() {
	it("get value from config", function() {
		config.init(path.join(__dirname, 'options.json'));
		expect(config.reader.get('name')).to.be.equal('test file 1');
	});
});
