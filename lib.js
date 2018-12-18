const userName = process.env.SUDO_USER;
const fs = require('fs');
const execSync = require('child_process').execSync;

const newSite = serverName => {
	if(serverName !== undefined) {

		let re = /^\s*$/m;
		let hosts = fs.readFileSync('/etc/hosts', 'utf-8');
		let  hostsEmptyLine = re.exec(hosts).index;
		let output = [hosts.substr(0, hostsEmptyLine), '127.0.1.1\t' + serverName + '\n', hosts.substr(hostsEmptyLine)].join('');
		let template = `
<VirtualHost *:80>
	ServerAdmin webmaster@localhost
	DocumentRoot /var/www/${serverName}/public_html
	ServerName ${serverName}

	ErrorLog \${APACHE_LOG_DIR}/error.log
	CustomLog \${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

<Directory /var/www/${serverName}/public_html>
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
    php_admin_value short_open_tag On
    php_admin_value mbstring.func_overload 2
    php_admin_value mbstring.internal_encoding UTF-8
    php_admin_value date.timezone Europe/Moscow
    php_admin_value opcache.revalidate_freq 0
    php_admin_value opcache.max_accelerated_files 100000
    php_admin_value display_errors On
    php_admin_value max_input_vars 10000
    php_admin_value upload_max_filesize 80M
</Directory>

# vim: syntax=apache ts=4 sw=4 sts=4 sr noet
`.trim();



		fs.writeFileSync(`/etc/apache2/sites-available/${serverName}.conf`, template);
		execSync(`a2ensite ${serverName}.conf`);
		fs.writeFileSync('/etc/hosts', output);
		execSync(`mkdir -p /var/www/${serverName}/public_html/`);
		execSync(`systemctl restart apache2`);
		fs.writeFileSync(`/var/www/${serverName}/public_html/index.php`, `<?php echo "${serverName} is working" ?>`);

		execSync(`chown -R ${userName}:${userName} /var/www/${serverName}/`);
	}
};

const regExpFromSite = site => {
	let escaped = site.replace(/\./g, '\\.');
	return new RegExp('^.+' + escaped + '\n', 'mg');
};

const removeSite = serverName => {

	let hosts = fs.readFileSync('/etc/hosts', 'utf-8');
	let re = regExpFromSite(serverName);
	if (!re.test(hosts)) {
		console.log('site was not found');
	}else {
		hosts = hosts.replace(re, '');
		fs.writeFileSync('/etc/hosts', hosts);
		execSync(`a2dissite ${serverName}`);
		fs.unlinkSync(`/etc/apache2/sites-available/${serverName}.conf`);
		execSync(`rm -r /var/www/${serverName}`);
		execSync('systemctl restart apache2');
	}
};
const listSites = () => {
   let sitesList = fs.readdirSync('/etc/apache2/sites-enabled');
   let rmIndex = sitesList.indexOf('000-default.conf');
   if(rmIndex !== -1){
       sitesList.splice(rmIndex,1);
       sitesList = sitesList.map(el => el.substr(0, el.length - 5));
   }

   return sitesList;
};

module.exports = { newSite, removeSite, listSites};
