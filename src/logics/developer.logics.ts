import { Request, Response } from "express";
import { iAllDeveloperInfos, iDeveloper, TDeveloper, TDeveloperInfo } from "../interfaces/developer.interfaces";
import { client } from "../database";
import { QueryConfig, QueryResult } from "pg";
import format from "pg-format";

export async function createDeveloper(request: Request, response: Response): Promise<Response> {

    const developerData: TDeveloper = request.body

    const queryString: string = format(`
        INSERT INTO
            developers
            (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(developerData),
        Object.values(developerData)
    )

    const queryResult: QueryResult<TDeveloper> = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}


export async function listDeveloper(request: Request, response: Response): Promise<Response> {

    const developerId = response.locals.queryResultDeveloper.id

    console.log(developerId)

    const queryString: string = `
        SELECT dev.id "developerId", dev.name "developerName", dev.email "developerEmail", info."developerSince" "developerInfoDeveloperSince", info."preferredOS" "developerInfoPreferredOS"
        FROM
            developers AS dev
        LEFT JOIN developer_infos AS info
            ON dev.id = $1 AND dev.id = info."developerId"
        WHERE dev.id = $1
        ;
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult: QueryResult<iAllDeveloperInfos> = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export async function updateDeveloper(request: Request, response: Response): Promise<Response> {
    const developerId = response.locals.queryResultDeveloper.id

    const developerData: Partial<TDeveloper> = request.body

    const queryString: string = format(`
        UPDATE developers
        SET (%I) = ROW(%L)
        WHERE id = $1
        RETURNING *;
    `,
        Object.keys(developerData),
        Object.values(developerData)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    const queryResult: QueryResult<TDeveloper> = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export async function deleteDeveloper(request: Request, response: Response): Promise<Response> {

    const developerId = response.locals.queryResultDeveloper.id

    const queryString : string = `
        DELETE FROM
            developers
        WHERE id = $1;
    `

    const queryConfig : QueryConfig = {
        text: queryString,
        values: [developerId]
    }

    await client.query(queryConfig)

    return response.status(204).send()
}

export async function createDeveloperInfo(request: Request, response: Response): Promise<Response> {

    const developerInfoData: TDeveloperInfo = request.body

    if (request.body.preferredOS !== "Windows" && request.body.preferredOS !== "Linux" && request.body.preferredOS !== "MacOS") {
        return response.status(400).json({
            "message": "Invalid OS option.",
            "options": ["Windows", "Linux", "MacOS"]
        })
    }

    developerInfoData.developerId = parseInt(request.params.id)

    const queryString: string = format(`
        INSERT INTO
            developer_infos(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(developerInfoData),
        Object.values(developerInfoData)
    )

    const queryResult: QueryResult = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}


