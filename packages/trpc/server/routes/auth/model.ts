import {z} from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
    fullName: z.string().describe("name of user"),
    email: z.email().describe("email of the user"),
    password: z.string().describe("password of user")
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of user")

})


export const signInUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("email of the user"),
    password: z.string().describe("password of the user")
});

export const signInUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("id of the user")
});

export const getLoggedInUserInfoModelInputModel = z.undefined();

export const getLoggedInUserInfoModelOutputModel = z.object({
    id: z.string().describe("id of the user"),
    fullName: z.string().describe("name of user"),
    email: z.email().describe("email of the user"),

});

