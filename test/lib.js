const expect = require('chai').expect,
	config = require('../index.js'),
	path = require('path');

const GOOD_PATH = path.join(__dirname, 'goodconfigs');
const BAD_PATH = path.join(__dirname, 'badconfigs');
const NOT_REAL_PATH = path.join(__dirname, 'aintreal');

describe("init", function() {
	it("init from existing file without error", function() {
		let t = ()=> {config.init(GOOD_PATH);};
		expect(t()).to.not.throw;
	});

	it("throw on fake filename", function() {
		let t = ()=> {config.init(NOT_REAL_PATH);};
		expect(t()).to.throw;
	});

	it("throw on not valid json", function() {
		let t = ()=> {config.init(BAD_PATH);};
		expect(t()).to.throw;
	});

	it("init with custom modules section path", function() {
		let t = ()=> {config.init(GOOD_PATH, 'modules2');};
		expect(t()).to.not.throw;
	});
});

describe("reader.get", function() {
	it("get value from config", function() {
		let conf = config.init(GOOD_PATH);
		expect(conf.get('name')).to.be.equal('test file 1');
	});
});

describe("init readerForModule", function() {
	it("init from existing file without error", function() {
		let t = ()=> {config.init(GOOD_PATH, 'modules2');};
		expect(t()).to.not.throw;
	});

	it("init from existing file without error with undefined modules path", function() {
		let t = ()=> {config.init(GOOD_PATH, undefined);};
		expect(t()).to.not.throw;
	});

	it("init from existing file without error with undefined module name", function() {
		configForModule = config.readerForModule();
		expect(configForModule.get('name')).to.be.deep.equal(config.createReader().get('name'));
	});
});

describe("readerForModule.get", function() {
	let configForModule;
	before(()=>{
		config.init(GOOD_PATH, 'modules2');
		configForModule = config.readerForModule('test');
	});

	it("get value from config", function() {
		expect(configForModule.get('variants')).to.be.deep.equal(["1","2","3"]);
	});

	it("get full module config", function() {
		expect(configForModule.get()).to.be.deep.equal({'variants':["1","2","3"]});
	});
});
