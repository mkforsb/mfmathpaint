Introduction
-
mfMathPaint is a modular multiuser web application paint program focused on mathematics. PHP/MySQL/JavaScript.

![Screenshot](http://lur.h1x.com/bathweirdo/ga/v2/pic.png "Screenshot")

Installation
-
	$ cd mfmathpaint
    /mfmathpaint$ editor setup.sql
    /mfmathpaint$ mysql -p < setup.sql
    /mfmathpaint$ editor db_config.php
    /mfmathpaint$ cd ..
	$ cp index.html-dist index.html

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
