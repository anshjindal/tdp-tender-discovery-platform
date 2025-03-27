FROM node:20

# Set working directory inside container
WORKDIR /tdp

# Install Nx CLI globally
RUN npm install -g nx

# Copy everything into container
COPY . .

# Install dependencies (safely)
RUN npm install --ignore-scripts

# Build the backend app (this creates dist/apps/backend/main.js)
RUN npx nx build backend

# Expose the backend port
EXPOSE 3000

# Set required env vars
ENV NODE_ENV=production
ENV SUPABASE_URL=https://xxxxx.supabase.co
ENV SUPABASE_SERVICE_KEY=your_actual_key


# Run the compiled app directly
CMD ["node", "dist/apps/backend/main.js"]
