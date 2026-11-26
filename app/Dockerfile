# Static hosting for Railway: Caddy serves this folder on $PORT
FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY . /srv
# Cache-busting: every deploy gets a new version on CSS/JS links
RUN sed -i "s/__V__/$(date +%s)/g" /srv/index.html
