import type { NextApiRequest, NextApiResponse } from 'next'
import { isLeft, isRight, Left, Right } from "fp-ts/Either";
import { getUserRepo } from '../../../server/repository/user';
import { ApiResult, CreateUserFailed, CreateUserResult, CreateUserSuccess } from '../../../types/types';
import { CreateUserFormValuesDecode } from '../../../types/io-ts-def';
import { MakeLeft, MakeRight } from '../../../utils/io-ts-helpers';
import { DEFAULT_PASSWORD } from '../../../server/repository/user/consts';

function makeSuccessResult(message: string): Right<CreateUserSuccess> {
    return MakeRight({
        result: "Success",
        message
    });
}

function makeFailedResult(message: string): Left<CreateUserFailed> {
    return MakeLeft({
        result: "Failure",
        message
    })
}

async function getResult(body: unknown): Promise<ApiResult<CreateUserResult>> {
    if (!CreateUserFormValuesDecode.is(body)) {
        return {
            status: 400,
            body: makeFailedResult('Invalid request body - missing either username or password')

        };
    }

    const userRepo = getUserRepo();

    const existingUser = await userRepo.get(body.username);

    if (isRight(existingUser)) {
        // The user already exists, tell them off
        return {
            status: 400,
            body: makeFailedResult('A user with that username already exists')
        };
    }

    const create = await userRepo.insert(body.username);

    if (isRight(create)) {
        return {
            status: 200,
            body: makeSuccessResult(`Created user with username ${body.username} and password ${DEFAULT_PASSWORD}`)
        };
    }

    return {
        status: 400,
        body: makeFailedResult(`Failed to create user, please wait and try again: ${create.left}`)
    };
}
export default async function loginRoute(req: NextApiRequest, res: NextApiResponse<CreateUserResult>) {
    const data = await req.body;

    const { status, body } = await getResult(data);

    res.status(status).json(body);
}
