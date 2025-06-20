FROM node:20-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

# Expose port (default 3000, can be overridden)
EXPOSE ${PORT:-3001}

CMD ["npm", "start"]