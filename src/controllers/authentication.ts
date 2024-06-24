import express  from "express";
import { getUserByEmail ,createUser} from "../db/users";
import { authentication ,random} from "../helpers";

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const {username, email, password} = req.body

        if(!username || !email || !password) {
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser) {
            return res.sendStatus(400)
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password),
            }
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const {email, password} = req.body; 

        if(!email || !password) {
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

        if (!user) {
            return res.sendStatus(401)
        }

        const expectedHash = authentication(user.authentication.salt, password);

        if(expectedHash !== user.authentication.password) {
            return res.sendStatus(403)
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie('ANTOIO-AUTH', user.authentication.sessionToken, {
            domain: 'localhost',
            path: '/',
            sameSite: 'strict',
            secure: true
        })

        res.status(200).json(user).end()

    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
}