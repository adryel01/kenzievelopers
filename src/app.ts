import express, { Application } from "express";
import "dotenv/config";

import { verifyDeveloperExtistsMiddleware, verifyEmailAlreadyExistsMiddleware, verifyInfosAlreadyRegiteredMiddleware } from "./middlewares/developer.middlewares";
import { createDeveloper, createDeveloperInfo, deleteDeveloper, listDeveloper, updateDeveloper } from "./logics/developer.logics";
import { createProject, createProjectTechnology, deleteProject, deleteProjectTechnology, listProjects, updateProject } from "./logics/project.logics";
import { verifyDeveloperIdExtistsMiddleware, verifyProjectExtistsMiddleware, verifyTechnologyAlreadyExistsMiddleware, verifyTechnologyIsSupportedMiddleware, verifyTechnologyIsVinculatedMiddleware, verifyTechnologyParamsIsSupportedMiddleware } from "./middlewares/project.middlewares";

const app: Application = express();
app.use(express.json())

app.post('/developers', verifyEmailAlreadyExistsMiddleware, createDeveloper)

app.get('/developers/:id', verifyDeveloperExtistsMiddleware, listDeveloper)

app.patch('/developers/:id', verifyDeveloperExtistsMiddleware, verifyEmailAlreadyExistsMiddleware, updateDeveloper)

app.delete('/developers/:id', verifyDeveloperExtistsMiddleware, deleteDeveloper)

app.post('/developers/:id/infos', verifyDeveloperExtistsMiddleware, verifyInfosAlreadyRegiteredMiddleware, createDeveloperInfo)


// ------------------ PROJECTS -------------------------

app.post('/projects', verifyDeveloperIdExtistsMiddleware, createProject)

app.get('/projects/:id', verifyProjectExtistsMiddleware, listProjects)

app.patch('/projects/:id', verifyProjectExtistsMiddleware, verifyDeveloperIdExtistsMiddleware, updateProject)

app.delete('/projects/:id', verifyProjectExtistsMiddleware, deleteProject)

app.post('/projects/:id/technologies', verifyProjectExtistsMiddleware, verifyTechnologyIsSupportedMiddleware, verifyTechnologyAlreadyExistsMiddleware, createProjectTechnology)

app.delete('/projects/:id/technologies/:name', verifyProjectExtistsMiddleware, verifyTechnologyParamsIsSupportedMiddleware, verifyTechnologyIsVinculatedMiddleware, deleteProjectTechnology)

export default app;
