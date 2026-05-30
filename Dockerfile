# Feuerwehr Esselborn Website
# Static HTML site served by nginx

FROM nginx:alpine

# Copy website files
COPY . /usr/share/nginx/html/

# Remove unnecessary files from the image
RUN rm -f /usr/share/nginx/html/Dockerfile \
    /usr/share/nginx/html/.dockerignore \
    /usr/share/nginx/html/.gitignore \
    /usr/share/nginx/html/README.md \
    /usr/share/nginx/html/CHANGELOG.md \
    /usr/share/nginx/html/DEPLOYMENT.md \
    /usr/share/nginx/html/MIGRATION.md \
    /usr/share/nginx/html/MVP-PLAN.md \
    /usr/share/nginx/html/PROJECT-SUMMARY.md \
    /usr/share/nginx/html/SECURITY.md \
    /usr/share/nginx/html/TODO.md \
    /usr/share/nginx/html/ARCHITECTURE.md \
    /usr/share/nginx/html/DOMAIN-CHECK.md \
    /usr/share/nginx/html/NGINX-PROXY-MANAGER.md \
    /usr/share/nginx/html/TESTPLAN.md \
    /usr/share/nginx/html/meta-tags-snippet.html \
    /usr/share/nginx/html/htaccess.txt && \
    rm -rf /usr/share/nginx/html/.git \
    /usr/share/nginx/html/.github

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
