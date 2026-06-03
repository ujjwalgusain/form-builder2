import {z} from "zod"

export const createUserWithEmailAndPassword = z.object({
    fullName: z.string().describe("full name of the user"),
    email: z.email().describe("email of the user"),
    password: z.string().describe("password of the user")
})

export type CreateUserWithEmailAndPasswordType = z.infer<typeof createUserWithEmailAndPassword>


export const generateUserTokenPayload = z.object({
    id: z.string().describe("id of user")
})

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const signInUserWithEmailAndPassword = z.object({
     email: z.email().describe("email of the user"),
    password: z.string().describe("password of the user")

})

export type SignInUserWithEmailAndPasswordType = z.infer<typeof signInUserWithEmailAndPassword>;
