FROM node:20 AS build

WORKDIR /tdp

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./nx.json ./
COPY ./migrations.json ./
COPY ./tsconfig.base.json ./
COPY ./tsconfig.json ./

RUN mkdir ./apps-e2e
COPY ./apps-e2e ./apps-e2e

RUN npm i

RUN mkdir -p ./apps/frontend
COPY ./apps/frontend ./apps/frontend

EXPOSE 4200

CMD ["sh", "-c", "npx nx sync && npm run start:frontend"]

LABEL branch="feat_tdp_204"


##### COMMANDS FOR BUILDING AND RUNNING #####
## Note: Run these commands in the root folder (probably ./tdp-tender-discovery-platform)

### Command to build this Dockerfile:
# docker build -f ./apps/frontend/Dockerfile -t frontend:feat_tdp_204 .

### Command to run this Dockerfile:
# docker run -d -p 4200:4200 frontend:feat_tdp_204
