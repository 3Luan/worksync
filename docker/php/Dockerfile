FROM php:8.2.0-fpm

RUN apt-get update && apt-get install -y \
    apt-transport-https apt-utils build-essential curl git unzip zlib1g-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libicu-dev locales \
    && docker-php-ext-install bcmath gd zip pdo_mysql mysqli \
    && pecl install xdebug && docker-php-ext-enable xdebug \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@1.22.18 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

#bcmath
RUN docker-php-ext-install bcmath

# Install GD and Zip extensions
RUN docker-php-ext-install gd zip

# Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/bin --filename=composer && \
    php -r "unlink('composer-setup.php');"

COPY ./docker/php/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Extension mysql driver for mysql
RUN docker-php-ext-install pdo_mysql mysqli

# Install node and nvm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@1.22.18

# Add yarn
RUN npm install --global yarn@1.22.18
