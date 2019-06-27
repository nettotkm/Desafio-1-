const express = require("express");
const server = express();

server.use(express.json());

//middleware
function existProject(req, res, next) {
  const { id } = req.params;
  const project = projects.findIndex(i => i.id === id);
  if (project < 0) {
    return res.status(400).json({ error: "project not exist" });
  }
  req.project = project;
  return next();
}

//requisition counter
let contador = 0;
server.use((req, res, next) => {
  contador += 1;
  console.log(contador);
  return next();
});

// starting projects
const projects = [
  { id: "1", title: "Projeto 1", tasks: [] },
  { id: "2", title: "Projeto 2", tasks: [] }
];

//list all projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//register a project
server.post("/projects", (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push(req.body);
  return res.json(projects);
});

//Change project title with id present in route parameters
server.put("/projects/:id", existProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(i => i.id === id);
  project.title = title;
  return res.json(projects);
});

//register a task within a project
server.post("/projects/:id/tasks", existProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(i => i.id === id);
  project.tasks.push(title);
  return res.json(`tarefa adicionada ao projeto ${project.title}`);
});

//delete a project with ID presente in the route parameters without beig by the Index
server.delete("/projects/:id", existProject, (req, res) => {
  const { id } = req.params;
  const project = projects.find(i => i.id === id);
  const position = projects.indexOf(project);
  projects.splice(position, 1);
  return res.send("projeto deletado");
});

server.listen(3000);
