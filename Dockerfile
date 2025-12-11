# Start from a standard Node.js image
FROM node:20-slim

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (3000)
EXPOSE 3000

# Run the start script defined in package.json
CMD ["npm", "start"]
