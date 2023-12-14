import express from "express";

import { register, login, loginWithGoogle } from "../controllers/auth";

export default (router: express.Router) => {
    router.post('/api/auth/register', register);
    router.post('/api/auth/login', login);
    router.post('/api/auth/loginWithGoogle', loginWithGoogle);
}