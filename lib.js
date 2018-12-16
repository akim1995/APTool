const userName = process.env.SUDO_USER;
const fs = require('fs');
const exec = require('child_process').exec;

function newSite(serverName ) {
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
		fs.writeFileSync('/etc/hosts', output);
		exec(`mkdir -p /var/www/${serverName}/public_html/`, function(err) {});
		exec(`a2ensite ${serverName}.conf`, function(err) {
			if(err) {
				console.log(err);
			}
		});
		exec(`systemctl restart apache2`, function(err) {
			if(err) {
				console.log(err);
			}
		});
		fs.writeFileSync(`/var/www/${serverName}/public_html/index.php`, `<?php echo "${serverName} is working" ?>`);

		exec(`chown -R ${userName}:${userName} /var/www/${serverName}/`, function(err) {
			if(err) {
				console.log(err);
			}
		});
	}
}

module.exports = { newSite };
