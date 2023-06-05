import { Request, Response } from "express";
import { client } from "../database";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";
import { TProject, TProjectTechnology, TTechnology, iAllProjects, iRequestTechnologyName, iTechnologies } from "../interfaces/project.interfaces";

export async function createProject(request: Request, response: Response): Promise<Response> {

    const projectData: TProject = request.body

    const queryString: string = format(`
        INSERT INTO
            projects
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(projectData),
        Object.values(projectData)
    )

    const queryResult: QueryResult<TProject> = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}

export async function listProjects(request: Request, response: Response): Promise<Response> {

    const projectId = response.locals.queryResultProject.id

    const queryString: string = `
            SELECT p.id "projectId", p.name "projectName", p.description "projectDescription", p."estimatedTime" "projectEstimatedTime", p.repository "projectRepository", p."startDate" "projectStartDate", p."endDate" "projectEndDate", p."developerId" "projectDeveloperId", pt."technologyId", t.name "technologyName"  
            FROM
                projects AS p
            LEFT JOIN projects_technologies AS pt
                ON p.id = $1 AND p.id = pt."projectId"
            LEFT JOIN technologies AS t
                ON pt."technologyId" = t.id
            WHERE p.id = $1
            ;
        `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    }

    const queryResult: QueryResult<iAllProjects> = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows)

}

export async function updateProject(request: Request, response: Response): Promise<Response> {
    const projectId = response.locals.queryResultProject.id

    const projectData: Partial<TProject> = request.body

    if (request.body.id) {
        return response.status(400).send()
    }

    const queryString: string = format(`
        UPDATE projects
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
    `,
        Object.keys(projectData),
        Object.values(projectData)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    }

    const queryResult: QueryResult<TProject> = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export async function deleteProject(request: Request, response: Response): Promise<Response> {

    const projectId = response.locals.queryResultProject.id

    const queryString: string = `
        DELETE FROM
            projects
        WHERE id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    }

    await client.query(queryConfig)

    return response.status(204).send()
}

export async function createProjectTechnology(request: Request, response: Response): Promise<Response> {

    const projectId = response.locals.queryResultProject.id

    const projectTechnologyName: iRequestTechnologyName = request.body.name

    const queryStringRequest: string = `
        INSERT INTO projects_technologies ("technologyId", "projectId")
        VALUES (
 	        (SELECT 
                id 
            FROM 
                technologies 
 	        WHERE 
                name = $1)
            ,$2)
    `

    const queryConfigRequest: QueryConfig = {
        text: queryStringRequest,
        values: [projectTechnologyName, projectId]
    }

    await client.query(queryConfigRequest)

    const queryStringResult: string = `
    SELECT pt."technologyId", t.name "technologyName" ,p.id "projectId", p.name "projectName", p.description "projectDescription", p."estimatedTime" "projectEstimatedTime", p.repository "projectRepository", p."startDate" "projectStartDate", p."endDate" "projectEndDate"  
	FROM
		projects AS p
	LEFT JOIN projects_technologies AS pt
		ON p.id = $1 AND p.id = pt."projectId"
	LEFT JOIN technologies AS t
        ON pt."technologyId" = t.id
	WHERE p.id = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryStringResult,
        values: [projectId]
    }

    const queryResult: QueryResult<TProject> = await client.query(queryConfig)

    return response.status(201).json(queryResult.rows[0])
}

export async function deleteProjectTechnology(request: Request, response: Response): Promise<Response> {

    const technologyName = request.params.name

    const projectId = response.locals.queryResultProject.id

    const queryString: string = `
        DELETE FROM
            projects_technologies
        WHERE 
            "technologyId" = (
                SELECT 
                    id 
                FROM 
                    technologies 
                WHERE 
                    name = $1)
        AND "projectId" = $2;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [technologyName, projectId]
    }

    await client.query(queryConfig)

    return response.status(204).send()
}