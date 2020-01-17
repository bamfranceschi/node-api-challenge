const express = require("express");

const projectRouter = require("./data/routes/projectRouter.js");
const actionRouter = require("./data/routes/actionRouter");

const server = express();

server.use(express.json());
server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

module.exports = server;
