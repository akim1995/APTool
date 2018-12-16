const yargs = require('yargs');
const newSite = require('./lib.js').newSite;

const argv = yargs.argv;
let command = argv._[0];

// console.log('Yargs', argv);

const serverName = argv.name;


// TODO write list function
// TODO write remove function
// TODO make program ask for sudo permissions;


if (command === 'create' && typeof serverName !== 'undefined') {
	newSite(serverName );
}else {
	console.log('command is not recognized try command create with --title');
}
console.log('done');
