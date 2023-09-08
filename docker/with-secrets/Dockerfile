FROM php:8.1-apache-bookworm

RUN docker-php-ext-configure pdo_mysql \
    && docker-php-ext-install pdo_mysql \
    && sed -i 's/Listen 80/Listen 8080/g' /etc/apache2/ports.conf \
    && sed -i 's/:80/:8080/g' /etc/apache2/sites-enabled/000-default.conf \
    && mkdir /etc/mfmathpaint \
    && touch /etc/mfmathpaint/docker-setup-required \
    && chown -R www-data:www-data /etc/mfmathpaint

COPY docker/with-secrets/docker-entrypoint.sh /usr/local/bin/

COPY --chown=www-data:www-data mfmathpaint /var/www/html/mfmathpaint

COPY --chown=www-data:www-data index.html-dist /var/www/html/index.html

USER www-data

EXPOSE 8080/tcp

ENTRYPOINT ["docker-entrypoint.sh"]
