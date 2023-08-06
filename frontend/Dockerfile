FROM node:16 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install --force
COPY ./ /app/
RUN npm run build

FROM nginx:latest
EXPOSE 80
COPY --from=build-stage /app/dist/photo/ /usr/share/nginx/html
#COPY --from=build-stage /app/nginx.custom.conf /etc/nginx/conf.d/default.conf

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
