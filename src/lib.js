/**
 * @module not-config
 */


/**
  * Interface for nconf reader
  */
exports.reader = require('nconf');

/**
 * Read configuration from specified file
 * @param {string} config_path - full file name
 */

exports.init = (config_path)=>{
	try{
		nconf.argv().env('__').file({file: config_path});
	}catch(e){

	}
};
