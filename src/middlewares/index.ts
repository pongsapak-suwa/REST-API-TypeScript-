import express from 'express';
import {get , merge}  from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            return res.sendStatus(403);
        }

        if(id !== currentUserId.toString()){
            return res.sendStatus(403);
        }

        next();

    }catch(error){
        console.log(error)
        return res.sendStatus(500)
    }
}

export const isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['ANTONIO-AUTH'];

        if (!sessionToken) {
            return res.sendStatus(403);
        }

        const existingUser = getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return res.sendStatus(403);
        }

        merge(req, {identity: existingUser});
        return next();

    }catch(error){
        console.log(error)
        return res.sendStatus(500)
    }
}