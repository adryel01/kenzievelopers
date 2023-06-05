import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TProject, TTechnology, iRequestTechnologyName } from "../interfaces/project.interfaces";

export async function verifyDeveloperIdExtistsMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const developerId: number = request.body.developerId

    const queryString: string = `
		SELECT * FROM
		    developers
		WHERE 
		    id = $1
	`

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult: QueryResult<TProject> = await client.query(queryConfig)

    if (queryResult.rows.length == 0) {
        return response.status(404).json({ "message": "Developer not found." })
    }

    // response.locals.queryResultDeveloper = queryResult.rows[0]

    return next()
}


export async function verifyProjectExtistsMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const projectId: number = parseInt(request.params.id)

    const queryString: string = `
		SELECT * FROM
		    projects
		WHERE 
		    id = $1
	`

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    }

    const queryResult: QueryResult<TProject> = await client.query(queryConfig)

    if (queryResult.rowCount == 0) {
        return response.status(404).json({ "message": "Project not found." })
    }

    response.locals.queryResultProject = queryResult.rows[0]

    return next()
}

export async function verifyTechnologyIsSupportedMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const technologyName: iRequestTechnologyName = request.body.name

    const queryString: string = `
        SELECT *
        FROM 
            technologies
        WHERE 
            name = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [technologyName]
    }

    const queryResult: QueryResult<TTechnology> = await client.query(queryConfig)

    if (queryResult.rows.length == 0) {
        return response.status(400).json({
            "message": "Technology not supported.",
            "options": [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
            ]
        })
    }

    response.locals.technology = queryResult.rows[0]

    return next()
}

export async function verifyTechnologyAlreadyExistsMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const technologyId = response.locals.technology.id

    const projectId = response.locals.queryResultProject.id

    const queryString: string = `
        SELECT *
        FROM 
            projects_technologies
        WHERE 
            "technologyId" = $1 AND "projectId" = $2
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [technologyId, projectId]
    }

    const queryResult: QueryResult<TTechnology> = await client.query(queryConfig)

    if (queryResult.rows.length == 1) {
        return response.status(409).json({
            "message": "This technology is already associated with the project"
        })
    }


    return next()
}


export async function verifyTechnologyParamsIsSupportedMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const technologyName: string = request.params.name

    const queryString: string = `
        SELECT *
        FROM 
            technologies
        WHERE 
            name = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [technologyName]
    }

    const queryResult: QueryResult<TTechnology> = await client.query(queryConfig)

    if (queryResult.rows.length == 0) {
        return response.status(400).json({
            "message": "Technology not supported.",
            "options": [
                "JavaScript",
                "Python",
                "React",
                "Express.js",
                "HTML",
                "CSS",
                "Django",
                "PostgreSQL",
                "MongoDB"
            ]
        })
    }

    response.locals.technologyParams = queryResult.rows[0].technologyName

    return next()
}


export async function verifyTechnologyIsVinculatedMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const technologyName = response.locals.technologyParams

    const projectId = response.locals.queryResultProject.id

    const queryString: string = `
        SELECT * FROM
            projects_technologies
        WHERE 
            "technologyId" = (
                SELECT 
                    id 
                FROM 
                    technologies 
                WHERE 
                    name = $1)
        AND 
            "projectId" = $2;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [technologyName, projectId]
    }

    const queryResult: QueryResult<TTechnology> = await client.query(queryConfig)

    if (queryResult.rows.length == 0) {
        return response.status(400).json({
            "message": "Technology not related to the project."
        })
    }

    response.locals.technologyParams = queryResult.rows[0]

    return next()
}

