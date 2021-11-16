import type { NextApiRequest, NextApiResponse } from 'next'
import { GameAPI, UpcomingEventsAPI } from "../../../types/types";
import { getGamesRepo } from "../../../server/repository/games";
import { isRight } from "fp-ts/Either";

const gameRespository = getGamesRepo();

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const allGames = gameRespository.all();

    if (isRight(allGames)) {
        const apiResponse: GameAPI = {
            games: allGames.right
        };

        res.json(apiResponse);
        return;
    }

    res.status(500).json(allGames.left)
};


export default handler;
