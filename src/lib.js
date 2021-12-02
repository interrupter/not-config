const path = require('path'),
	notPath = require('not-path'),
	deepmerge = require('./deepmerge.js');

const ENV = process.env.NODE_ENV || 'development';
var CONFIG = {};

exports.PATH = null;

/**
 * @module not-config
 */
/**
	* @const {string} OPT_MODULES_KEY default root of modules configurations directory
	*/
const OPT_MODULES_KEY = 'modules';
/**
 * @const {string} OPT_KEYS_SEPARATOR separator of path's keys
 */
const OPT_KEYS_SEPARATOR = '.';
/**
 * @const {string} OPT_KEYS_SEPARATOR_ENV separator of path's keys in ENV
 */
const OPT_KEYS_SEPARATOR_ENV = '__';
/**
 * @member {string} currentModulesKey root of modules configurations directory
 */
var currentModulesKey = OPT_MODULES_KEY;

exports.getConfPath = (name)=>{
	return path.join(exports.PATH, name + '.json');
};

exports.loadConfig = (name)=>{
	return require(exports.getConfPath(name));
};

exports.importENV = ()=>{
	let keys = Object.keys(process.env);
	for(let key of keys){
		if(key.indexOf(OPT_KEYS_SEPARATOR_ENV) > -1){
			let realKey = key;
			while(realKey.indexOf(OPT_KEYS_SEPARATOR_ENV) > -1){ realKey = realKey.replace(OPT_KEYS_SEPARATOR_ENV, OPT_KEYS_SEPARATOR);}
			notPath.set(realKey, CONFIG, process.env[key]);
		}
	}
};

/**
 * Read configuration from specified file
 * @param {string} config_path - full path to configs directory (common.json and other according to variety of ENV variable possible values)
 * @param {string} modules_key - path to modules block in config JSON
 */

exports.init = (config_path, modules_key = OPT_MODULES_KEY)=>{
	try{
		//clearing storage
		while(Object.keys(CONFIG).length){
			delete CONFIG[Object.keys(CONFIG)[0]];
		}
		//updating current modules key if presented
		if (modules_key) {
			currentModulesKey = modules_key;
		}
		exports.PATH = config_path;
		let commonConf = exports.loadConfig('common');
		CONFIG = deepmerge(CONFIG, commonConf);
		let envConf = exports.loadConfig(ENV);
		CONFIG = deepmerge(CONFIG, envConf);
		exports.importENV();
		return exports.createReader();
	}catch(e){
		return false;
	}
};

function joinKeys(a, b){
	let fullkey = b;
	if(a.length){
		if(b.length){
			fullkey = [a, b].join(OPT_KEYS_SEPARATOR);
		}else{
			fullkey = a;
		}
	}
	return fullkey;
}

exports.createReader = (moduleName = false)=>{
	let prefix = '';
	if(moduleName){
		prefix = [currentModulesKey, moduleName].join(OPT_KEYS_SEPARATOR);
	}
	return {
		get(key = '', fallback = undefined){
			let fullkey = joinKeys(prefix, key);
			while(fullkey.indexOf(':') > -1){fullkey = fullkey.replace(':', OPT_KEYS_SEPARATOR);}
			let result = notPath.get(fullkey, CONFIG);
			if(typeof fallback !== 'undefined' && typeof result === 'undefined'){
				return fallback;
			}else{
				return result;
			}
		},
		set(key = '', value){
			if(!key){
				return this;
			}else{
				let fullkey = joinKeys(prefix, key);
				while(fullkey.indexOf(':') > -1){fullkey = fullkey.replace(':', OPT_KEYS_SEPARATOR);}
				notPath.set(fullkey, CONFIG, value);
				return this;
			}
		}
	};
};

/**
 * Interface for modules.
 * Gives read-only access for module options.
 * @param {string} moduleName name of the module
 * @return {object} read-only interface
 */
exports.readerForModule = (moduleName)=>{
	return exports.createReader(moduleName);
};
