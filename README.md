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
The [docker](https://github.com/mkforsb/mfmathpaint/tree/master/docker) folder contains a `Dockerfile` to build
an mfMathPaint image based on [php:8.1-apache-bullseye](https://hub.docker.com/layers/library/php/8.1-apache-bullseye/images/sha256-b1eae7da0f50e4e7e9137348a0f6e8d2229ee3722f8632edfa11dc4a9dbf58de?context=explore), along with a 
`docker-compose.yml` file to build and run mfMathPaint together with a stock MariaDB container ([mariadb:10.5](https://hub.docker.com/layers/library/mariadb/10.5/images/sha256-aa1ccc18000c32d1f39ac0b055117b27bffd93e622ec961d682de40fe2a1a95f?context=explore))

    $ docker compose -f docker/docker-compose.yml up

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
