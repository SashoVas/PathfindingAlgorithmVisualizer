FROM node:18

WORKDIR /app

COPY PathfindingAlgorithmVisualizer/package*.json ./

RUN npm install -g @angular/cli
RUN npm install

COPY PathfindingAlgorithmVisualizer/. .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]