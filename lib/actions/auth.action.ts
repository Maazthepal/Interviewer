"use server"

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
    const { uid,name,email } = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get()

        if( userRecord.exists) {
            return {
                succes: false,
                message: "User Already exists. Please sign-in Instead."
            }
        }

        await db.collection('user').doc(uid).set({
            name: name,
            email: email
        })

        return {
            succes : true,
            message: "Account Created Successfully. Please sign in."
        }
    } catch(e: any) {
        console.error('Error creating a user', e );

        if(e.code === 'auth/email-already-exists') {
            return {
                succes : false,
                message: "This E-mail is already in use."
            }
        }
    }

    return {
        succes: false,
        message: "Failed to create an account"
    }
}

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK * 1000
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONE_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    }
    )
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);

        if(!userRecord) {
            return {
                success: false,
                message: "User does not exist. Create an account instead."
            }
        }

        await setSessionCookie(idToken)
    } catch(e) {
        console.log(e)
        return {
            success: false,
            message: "Failed to log into an account."
        }
    }
}

export async function getCurrentUser(): Promise<User | null > {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try {
        const decodeClaims = await auth.verifySessionCookie(sessionCookie, true)

        const userRecord = await db.collection('users').doc(decodeClaims.uid).get()

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id
        } as User;
    } catch(e) {
        console.log(e)
        return null
    }
}

export async function isAuthnticated() {
    const user = await getCurrentUser();

    return !!user;
}