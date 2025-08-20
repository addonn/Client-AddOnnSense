# Step 1: Use an official Node.js image to install dependencies
FROM node:18 AS build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the application files into the container
COPY . .

# Step 6: Build the Angular app
RUN npm run build --prod

# Step 7: Use a smaller image for serving the app
FROM nginx:alpine

# Step 8: Copy the built Angular app to Nginx's default directory for serving static files
COPY --from=build /app/dist/com.addonn.app.assistant/browser /usr/share/nginx/html

# Step 9: Expose port 80 to access the app
EXPOSE 80

# Step 10: Start Nginx to serve the Angular app
CMD ["nginx", "-g", "daemon off;"]
 