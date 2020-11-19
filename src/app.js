const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

function ValidIdRepository(request, response, next){
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({"error": "Repository not found"}); 
  }

  return next();
}

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const dados = {id: uuid(), likes: 0, title, url, techs };

  repositories.push(dados);

  response.status(201).json(dados);
});

app.put("/repositories/:id", ValidIdRepository, (request, response) => {
  const {id} = request.params;
  const {title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);
  const countLike = repositories[repositoryIndex].likes;

  const repository = {
    id, title, url, techs, likes: countLike
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", ValidIdRepository, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", ValidIdRepository, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(rep => rep.id === id);

  const like = {
    owner: 'Hugo Vinicius',
    repositoryId: repositoryIndex
  }

  likes.push(like);

  const repository =  repositories[repositoryIndex];
  repository.likes = repository.likes + 1;
  repositoryIndex[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
