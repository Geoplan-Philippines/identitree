FROM node:22-alpine

WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm install
RUN npm run build --workspace=web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=web"]
