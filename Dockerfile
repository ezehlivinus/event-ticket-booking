FROM node:22-alpine AS base
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

# Development stage
FROM base AS development
RUN yarn install
COPY . .
CMD ["npm", "run", "start:dev"]

# Production dependencies
FROM base AS production-deps
RUN yarn install --production

# Build stage
FROM base AS build
RUN yarn install
COPY . .
RUN npm run build

# Production stage
FROM base AS production
COPY --from=production-deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package*.json ./
CMD ["npm", "run", "start:prod"]