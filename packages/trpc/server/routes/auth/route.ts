import { authenticatedProcedure, publicProcedure, router } from "../../trpc";

import {createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, signInUserWithEmailAndPasswordInputModel,signInUserWithEmailAndPasswordOutputModel,getLoggedInUserInfoModelInputModel,getLoggedInUserInfoModelOutputModel} from "./model";

import { userService } from "../../services";

import { generatePath } from "../../utils/path-generator";
import { email } from "zod";
const getPath = generatePath("/authentication");
const TAGS = ["Authentication"]
const authCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
} as const;

export const authRouter = router({
    createUserWithEmailAndPassword: publicProcedure.meta({
        openapi: {
            method: "POST",
            path: getPath("/createUserWithEmailAndPassword"),
            tags: TAGS
        }
    }).input(createUserWithEmailAndPasswordInputModel).output(createUserWithEmailAndPasswordOutputModel).mutation(async ({input, ctx}) => {
        const {fullName, email, password} = input;

        const {id, token} =  await userService.createUserWithEmailAndPassword({
            fullName,
            email,
            password,
        });

        ctx.setCookie("token", token, authCookieOptions);

        return {
            id
        }
    }),

    signInUserWithEmailAndPassword: publicProcedure.meta({
        openapi: {
            method: "POST",
            path: getPath("/signInUserWithEmailAndPassword"),
            tags: TAGS
        }
    }).input(signInUserWithEmailAndPasswordInputModel).output(signInUserWithEmailAndPasswordOutputModel).mutation(async ({input, ctx}) => {
        const {email, password} = input;

        const {id, token} =  await userService.signInUserWithEmailAndPassword({
            email,
            password,
        });

        ctx.setCookie("token", token, authCookieOptions);

        return {
            id
        }
    }),

    getLoggedInUserInfo: authenticatedProcedure.meta({
        openapi: {
            method: "GET",
            path: getPath("/getLoggedInUserInfo"),
            tags: TAGS
        }
    }).input(getLoggedInUserInfoModelInputModel).output(getLoggedInUserInfoModelOutputModel).query(async({ctx}) =>{
        const {fullName, email, id} = await userService.getUserInfoById(ctx.user.id);

        return {
            id,
            fullName,
            email,
        }
    })
})
