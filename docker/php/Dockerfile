# Base image
FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    apt-transport-https apt-utils build-essential curl git unzip zlib1g-dev \
    libpng-dev libjpeg-dev libfreetype6-dev libzip-dev libicu-dev locales \
    && docker-php-ext-install bcmath gd zip pdo_mysql mysqli \
    && pecl install xdebug && docker-php-ext-enable xdebug \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer (PHP package manager)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Node.js + Yarn (for Vite)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn@1.22.18

# Copy custom PHP configuration files
COPY ./docker/php/php.ini /usr/local/etc/php/php.ini
COPY ./docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Set working directory
WORKDIR /var/www/html

# Check versions
RUN php -v && composer -V && node -v && yarn -v
