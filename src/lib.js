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
const OPT_KEYS_SEPARATOR = ':';
/**
 * @member {string} currentModulesKey root of modules configurations directory
 */
var currentModulesKey = OPT_MODULES_KEY;

/**
  * Interface for nconf reader
  */
exports.reader = require('nconf');

/**
 * Read configuration from specified file
 * @param {string} config_path - full file name
 * @param {string} modules_key - path to modules block in config JSON
 */

exports.init = (config_path, modules_key)=>{
	try{
		if (modules_key) {
			currentModulesKey = modules_key;
		}
		exports.reader.argv().env('__').file({file: config_path});
		return exports.reader;
	}catch(e){
		return false;
	}
};

/**
 * Interface for modules.
 * Gives read-only access for module options.
 * @param {string} moduleName name of the module
 * @return {object} read-only interface
 */

exports.readerForModule = (moduleName)=>{
	if (moduleName){
		return {
			get(key){
				let fullKey = [currentModulesKey, moduleName];
				if (key){
					fullKey.push(key);
				}
				return exports.reader.get(fullKey.join(OPT_KEYS_SEPARATOR));
			}
		};
	}else{
		return exports.reader;
	}
};
