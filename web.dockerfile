# web.dockerfile
FROM nginx:1.25

WORKDIR /var/www/html

# Copy custom nginx config
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built public from app image
COPY --from=worksync-app /var/www/html/public /var/www/html/public
