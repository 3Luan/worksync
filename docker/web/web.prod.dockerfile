FROM nginx:1.25

# Nginx config
COPY docker/web/default.prod.conf /etc/nginx/conf.d/default.conf

# Copy Laravel + frontend
COPY public/ /var/www/html/public/
COPY resources/ /var/www/html/resources/
COPY routes/ /var/www/html/routes/
COPY artisan /var/www/html/
COPY bootstrap/ /var/www/html/bootstrap/
COPY config/ /var/www/html/config/
COPY database/ /var/www/html/database/
COPY vendor/ /var/www/html/vendor/

WORKDIR /var/www/html
