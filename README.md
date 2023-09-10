Introduction
-
mfMathPaint is a modular multiuser web application paint program focused on mathematics. PHP/MySQL/JavaScript.

![Screenshot](https://raw.githubusercontent.com/mkforsb/mfmathpaint/master/doc/screenshot.png)

Installation
-
	$ cd mfmathpaint
    /mfmathpaint$ editor setup.sql
    /mfmathpaint$ mysql -p < setup.sql
    /mfmathpaint$ editor db_config.php
    /mfmathpaint$ cd ..
	$ cp index.html-dist index.html

Docker
-
A number of Docker setups are provided. All of them are based on a composition of [php:8.1-apache-bullseye](https://hub.docker.com/layers/library/php/8.1-apache-bullseye/images/sha256-b1eae7da0f50e4e7e9137348a0f6e8d2229ee3722f8632edfa11dc4a9dbf58de?context=explore) and [mariadb:10.5](https://hub.docker.com/layers/library/mariadb/10.5/images/sha256-aa1ccc18000c32d1f39ac0b055117b27bffd93e622ec961d682de40fe2a1a95f?context=explore).

The `simple` setup(s) will pass database credentials as environment variables defined in the Docker Compose file:

    # [/with-latex] denotes an optional subdirectory you can include if you want the LaTeX feature available.

    $ nano docker[/with-latex]/simple/docker-compose.yaml # change credentials, e.g MARIADB_USER, MARIADB_PASSWORD
    $ docker compose -f docker[/with-latex]/simple/docker-compose.yaml up

The `with-secrets` setup(s) will pass database credentials as file-based secrets, using the files in `docker/secrets`:

    $ echo myuser > docker/secrets/mariadb_user.txt
    $ echo mypass > docker/secrets/mariadb_password.txt
    $ docker compose -f docker[/with-latex]/with-secrets/docker-compose.yaml up

Finally, the `nonroot-db-with-secrets` setup(s) will use file-based secrets while also performing the MariaDB initialization in the build stage rather than at runtime. This allows us to specify a non-root user for the image and removes the need for the `SETUID` and `SETGID` capabilities.

    $ echo myuser > docker/secrets/mariadb_user.txt
    $ echo mypass > docker/secrets/mariadb_password.txt
    $ docker compose -f docker[/with-latex]/nonroot-db-with-secrets/docker-compose.yaml up

For security it is recommended to use one of the `nonroot-db-with-secrets` setups.

Enabling LaTeX
-
For Debian/Ubuntu and derivatives:

    $ apt-get install texlive-latex-base dvipng

Then edit your index.html to load `mfmathpaint/modules/latex.js`

License
-
GNU AGPLv3, http://www.gnu.org/licenses/agpl-3.0.html

* jQuery (c) jQuery Foundation used under the MIT License.
* jscolor (c) Jan Odvarko used under the GNU LGPL.
* math.js (c) Jos de Jong used under the Apache License, Version 2.0.
