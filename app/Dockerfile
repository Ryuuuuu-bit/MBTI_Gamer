# 16 Gamer Heroes on Railway: Node serves the site + visit counter (no npm packages)
FROM node:22-alpine
WORKDIR /srv
COPY . /srv
ENV PORT=8080 DATA_DIR=/data
EXPOSE 8080
CMD ["node", "server.js"]
