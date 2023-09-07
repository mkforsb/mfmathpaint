FROM php:8.1-apache-bookworm

RUN docker-php-ext-configure pdo_mysql && docker-php-ext-install pdo_mysql

COPY mfmathpaint /var/www/html/mfmathpaint

COPY index.html-dist /var/www/html/index.html

COPY docker/docker-entrypoint.sh /usr/local/bin/

ENTRYPOINT ["docker-entrypoint.sh"]
