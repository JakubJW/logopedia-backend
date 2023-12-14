import { OAuth2Client } from "google-auth-library";
import { createUser, getUserByEmail } from "../db/users";
import { auth, random } from "../helpers";

export async function verifyCredentials(token: any) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
        idToken: token,
    })
    .then((response) => {
        return response
    })
    .catch((error) => {
        console.log(error)
        return error
    });
    const payload = ticket.getPayload()
    return payload
}

export async function registerAccount(token: string) {
    try {
        const userData = await verifyCredentials(token);
        const { email  } = userData;

        const salt = random();
        await createUser({
            email: email,
            authentication: {
                salt,
                password: auth(salt, email),
            },
        });
        
        const existingUser = await getUserByEmail(email).select('+authentication.salt');
        existingUser.authentication.sessionToken = auth(salt, existingUser._id.toString());
        await existingUser.save();

        return existingUser;
    } catch (error) {
        console.log(error);
        return;
    }
}