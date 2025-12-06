# # web.dockerfile
# FROM nginx:1.25

# # Copy custom nginx config
# COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# # Copy built public from build context (we'll set build context to project root)
# COPY public /var/www/html/public

# WORKDIR /var/www/html

# web.dockerfile
FROM nginx:1.25

WORKDIR /var/www/html

# Copy custom nginx config
COPY docker/web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built public from app image
COPY --from=worksync-app /var/www/html/public /var/www/html/public
