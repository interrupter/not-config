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

	it("init with custom modules section path", function() {
		let t = ()=> {config.init(path.join(__dirname, 'options.json'), 'modules2');};
		expect(t()).to.not.throw;
	});
});

describe("reader.get", function() {
	it("get value from config", function() {
		config.init(path.join(__dirname, 'options.json'));
		expect(config.reader.get('name')).to.be.equal('test file 1');
	});
});

describe("init readerForModule", function() {
	it("init from existing file without error", function() {
		let t = ()=> {config.init(path.join(__dirname, 'options.json'), 'modules2');};
		expect(t()).to.not.throw;
	});

	it("init from existing file without error with undefined modules path", function() {
		let t = ()=> {config.init(path.join(__dirname, 'options.json'), undefined);};
		expect(t()).to.not.throw;
	});

	it("init from existing file without error with undefined module name", function() {
		configForModule = config.readerForModule();
		expect(configForModule).to.be.deep.equal(config.reader);
	});
});

describe("readerForModule.get", function() {
	let configForModule;
	before(()=>{
		config.init(path.join(__dirname, 'options.json'), 'modules2');
		configForModule = config.readerForModule('test');
	});

	it("get value from config", function() {
		expect(configForModule.get('variants')).to.be.deep.equal(["1","2","3"]);
	});

	it("get full module config", function() {
		expect(configForModule.get()).to.be.deep.equal({'variants':["1","2","3"]});
	});
});
