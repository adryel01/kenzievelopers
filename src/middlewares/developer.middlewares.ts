import { Request, Response, NextFunction } from "express";
import { QueryConfig, QueryResult } from "pg";
import { TDeveloper, TDeveloperInfo } from "../interfaces/developer.interfaces";
import { client } from "../database";


export async function verifyEmailAlreadyExistsMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const email: string = request.body.email

    const queryString: string = `
        SELECT * FROM
            developers
        WHERE
            email = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [email]
    }

    const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig)

    if (queryResult.rowCount == 1) {
        return response.status(409).json({ "message": "Email already exists." })
    }

    return next()
}


export async function verifyDeveloperExtistsMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void> {

    const id: number = parseInt(request.params.id)

    const queryString: string = `
		SELECT * FROM
		    developers
		WHERE 
		    id = $1
	`

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [id]
    }

    const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig)

    if (queryResult.rowCount == 0) {
        return response.status(404).json({ "message": "Developer not found." })
    }

    response.locals.queryResultDeveloper = queryResult.rows[0]

    return next()
}

export async function verifyInfosAlreadyRegiteredMiddleware(request: Request, response: Response, next: NextFunction): Promise<Response | void>{

    const developerId = response.locals.queryResultDeveloper.id

    const queryString: string = `
        SELECT * FROM
            developer_infos
        WHERE "developerId" = $1;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult: QueryResult<TDeveloperInfo> = await client.query(queryConfig)

    if(queryResult.rowCount == 1){
        return response.status(409).json({"message": "Developer infos already exists."})
    }

    return next()
}