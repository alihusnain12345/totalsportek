# Use official Node.js image
FROM node:22

# Set working directory inside container
WORKDIR /usr/src/app

# install required packages for system
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

    
# Copy rest of the application
COPY . .

# Install dependencies (no package.json used, just npm i)
RUN npm i

# Expose port (for your app, e.g. 5000)
EXPOSE 5000

# Run the app
CMD ["npm", "run", "start:dev"]
