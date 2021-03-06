const yargs = require('yargs');
const newSite = require('./lib.js').newSite;
const removeSite = require('./lib.js').removeSite;
const listSites = require('./lib.js').listSites;
const argv = yargs
	.command('create', 'Add new local site', {
		name: {
			describe: 'Name of the new site',
			demand: true,
			alias: 'n'
		}
	})
	.command('list', 'List all sites')
	.command('remove', 'Removes specified site', {
		name: {
			describe: 'Name of the removed site',
			demand: true,
			alias: 'n'
		}
	})
	.help()
.argv;
let command = argv._[0];

// console.log('Yargs', argv);

const serverName = argv.name;


// TODO make program ask for sudo permissions;
// TODO MAKE bitrix config optional


if (command === 'create' && typeof serverName !== 'undefined') {
	newSite(serverName );
} else if(command === 'remove' && typeof serverName !== 'undefined') {
		removeSite(serverName);
} else if(command === 'list') {
    listSites().forEach(site => {
        console.log(site);
    })
} else {
	console.log('command is not recognized try command create with --name');
}
console.log('done');

