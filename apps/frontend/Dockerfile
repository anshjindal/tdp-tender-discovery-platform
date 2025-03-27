FROM node:20

# Set working directory in the container
WORKDIR /tdp

# Install Nx CLI globally
RUN npm install -g nx

# Copy the whole monorepo
COPY . .

# Install dependencies (skip postinstall)
RUN npm install --ignore-scripts

# Build the frontend app
RUN npx nx build frontend

# Serve the compiled frontend using a simple static server
RUN npm install -g serve

# Expose frontend port
EXPOSE 4000

# Serve the build output
CMD ["serve", "-s", "dist/apps/frontend", "-l", "4000"]
