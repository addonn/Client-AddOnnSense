# Stage 1: Build Angular app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (better for caching)
COPY package*.json ./

# Install all dependencies (inside container, so Linux binaries are used)
RUN npm ci --no-audit --no-fund

# Copy the rest of the application code
COPY . .

# Build Angular app (Angular 18 works fine on Node 18)
RUN npm run build --production

# Stage 2: Serve app with Nginx
FROM nginx:alpine

# Remove the default config
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built Angular dist into Nginx html folder
COPY --from=build /app/dist/com.addonn.app.assistant/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
