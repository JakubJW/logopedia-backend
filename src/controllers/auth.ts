import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { random, auth } from "../helpers";
import { ApiResponse } from "../models/apiResponse";

export const login = async (req: express.Request, res: express.Response) => {
    const response = new ApiResponse();

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400);
        };

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if (!user) {
            response.setMessage('Nieprawidłowy e-mail lub hasło');
            response.setSuccess(false);
            return res.status(400).json(response).end();
        };

        const expectedHash = auth(user.authentication.salt, password);
        if (user.authentication.password !== expectedHash) {
            response.setMessage('Nieprawidłowe hasło');
            response.setSuccess(false);
            return res.status(403).json(response).end();
        };

        const salt = random();
        user.authentication.sessionToken = auth(salt, user._id.toString());
        await user.save();
        
        response.setData({
            id: user._id, 
            email: user.email, 
            sessionToken: user.authentication.sessionToken
        });
        response.setSuccess(true);
        return res.status(200).json(response).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};

export const register = async (req: express.Request, res: express.Response) => {
    const response = new ApiResponse();

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            response.setMessage('Użytkownik o takim adresie już istnieje');
            response.setSuccess(false);
            return res.status(400).json(response).end();
        }

        const salt = random();
        const user = await createUser({
            email,
            authentication: {
                salt,
                password: auth(salt, password),
            },
        });

        response.setData({
            id: user._id,
            email: user.email
        });
        response.setSuccess(true);
        return res.status(200).json(response).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}