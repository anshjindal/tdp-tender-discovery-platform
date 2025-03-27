FROM node:20

WORKDIR /tdp

COPY ./package.json ./
COPY ./nx.json ./
COPY ./migrations.json ./
COPY ./tsconfig.base.json ./
COPY ./tsconfig.json ./

RUN mkdir ./apps-e2e
COPY ./apps-e2e ./apps-e2e

RUN mkdir -p ./apps/backend
COPY ./apps/backend ./apps/backend

RUN npm i

EXPOSE 3000

CMD ["sh", "-c", "npx nx sync && npm run start:backend"]

LABEL branch="feat_tdp_204"


##### COMMANDS FOR BUILDING AND RUNNING #####
## Note: Run these commands in the root folder (probably ./tdp-tender-discovery-platform)

### Command to build this Dockerfile:
# docker build -f ./apps/backend/Dockerfile -t backend:feat_tdp_204 .

### Command to run this Dockerfile:
# docker run -d -p 3000:3000 backend:feat_tdp_204
