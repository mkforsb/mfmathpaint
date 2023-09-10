#!/bin/bash

if [ -f "/etc/mfmathpaint/docker-setup-required" ]; then
	read -r -d '' MARIADB_USER < /run/secrets/mariadb_user
	read -r -d '' MARIADB_PASSWORD < /run/secrets/mariadb_password

	OLDIFS="$IFS"
	IFS=

	read -r -d '' script <<-EOSCRIPT
		<?php
		\$dsn = 'mysql:dbname=mfmathpaint;host=${MARIADB_HOST}';
		\$user = '${MARIADB_USER}';
		\$password = '${MARIADB_PASSWORD}';
		for (\$i = 0; \$i < 60; ++\$i) {
			try {
				\$dbh = new PDO(\$dsn, \$user, \$password);
				echo 'Successfully connected to database' . PHP_EOL;
				break;
			} catch (Exception \$e) {
				echo 'Failed connecting to database, retrying in 5 seconds ...' . PHP_EOL;
				sleep(5);
			}
		}
		\$lines = explode("\\n", file_get_contents('/var/www/html/mfmathpaint/setup.sql'));
		foreach (\$lines as \$line) {
			if (\$line != '') {
				\$dbh->exec(\$line);
			}
		}
	EOSCRIPT

	echo "$script" > /tmp/setup.php
	php /tmp/setup.php
	rm /tmp/setup.php

	read -r -d '' config <<-EOCONFIG
		<?php
		define('MFMATHPAINT_DB_HOST', '${MARIADB_HOST}');
		define('MFMATHPAINT_DB_USER', '${MARIADB_USER}');
		define('MFMATHPAINT_DB_PASS', '${MARIADB_PASSWORD}');
		define('MFMATHPAINT_DB_DBNAME', 'mfmathpaint');
	EOCONFIG

	echo "$config" > /var/www/html/mfmathpaint/db_config.php

	rm /etc/mfmathpaint/docker-setup-required

	IFS="$OLDIFS"
fi

unset MARIADB_HOST MARIADB_USER MARIADB_PASSWORD

exec /usr/local/bin/docker-php-entrypoint apache2-foreground "$@"
