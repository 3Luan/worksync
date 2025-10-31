# Base image
FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    apt-transport-https apt-utils build-essential curl git unzip zlib1g-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libicu-dev locales \
    && docker-php-ext-install bcmath gd zip pdo_mysql mysqli pcntl \
    && pecl install xdebug && docker-php-ext-enable xdebug \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js via nvm + Yarn
ENV NVM_DIR=/root/.nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash \
    && . "$NVM_DIR/nvm.sh" \
    && nvm install 20.19.0 \
    && nvm use 20.19.0 \
    && nvm alias default 20.19.0 \
    && npm install -g yarn@1.22.18

# Make Node and Yarn available in all future RUN commands
ENV NODE_VERSION=20.19.0
ENV PATH=$NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Copy custom PHP configuration files
COPY ./docker/php/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Set working directory
WORKDIR /var/www/html

# Check versions
RUN php -v && composer -V && node -v && yarn -v
