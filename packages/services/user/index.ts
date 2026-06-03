import {createUserWithEmailAndPassword, type CreateUserWithEmailAndPasswordType, generateUserTokenPayload, type GenerateUserTokenPayloadType, signInUserWithEmailAndPassword, SignInUserWithEmailAndPasswordType } from "./model"
import {userTable} from "@repo/database/models/user"
import {db, eq} from "@repo/database"

import bcrypt from "bcryptjs"
import * as JWT from "jsonwebtoken"

import {env} from "../env"
import { email } from "zod"

export default class UserService {
    private async getUserByEmail(email: string){
        const result = await db.select().from(userTable).where(eq(userTable.email, email))

        if(!result || result.length === 0) return null;

        return result[0]
    }

private async generateUserToken(payload: GenerateUserTokenPayloadType ) {
    const {id} = await generateUserTokenPayload.parseAsync(payload);

    const token = JWT.sign({id},env.JWT_SECRET);

    return {token};
}
    
    public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordType) {
        const {fullName,email,password} = await createUserWithEmailAndPassword.parseAsync(payload);

        const existingUser = await this.getUserByEmail(email);

        if(existingUser) throw new Error("user with this email already exist");

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await db.insert(userTable).values({fullName,
            email,passwordHash
        }).returning({ id: userTable.id});

        if (!result || result.length === 0 || !result[0]?.id) {
            throw new Error("something went wrong while creating a user");
        }


        const {token} = await this.generateUserToken({id: result[0].id});


        return{
            id: result[0].id,
            token,
        }


    
    
    }

    public async signInUserWithEmailAndPassword(payload: SignInUserWithEmailAndPasswordType) {
        const {email, password} = await signInUserWithEmailAndPassword.parseAsync(payload);


        const existingUser = await this.getUserByEmail(email);

        if(!existingUser) {
            throw new Error("user with this email does not exist")
        }

        if(!existingUser.passwordHash){
            throw new Error("invalid authentication method")
        }

        const isvalid = await bcrypt.compare(password, existingUser.passwordHash);

        if(!isvalid){
            throw new Error("invalid email and password")
        }

        const {token} = await this.generateUserToken({id: existingUser.id});

         return{
            id: existingUser.id,
            token,
        }
    }

    public async getUserInfoById(id: string) {
        const user = await db.select({id: userTable.id, fullName: userTable.fullName, email: userTable.email}).from(userTable).where(eq(userTable.id,id));

        if(!user || user.length === 0) throw new Error("user with this id does not exist");

        return user[0]!;
    }

    public async verifyAndDecodeUserToken(token: string) {
        try{
            const result =  JWT.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;

            return result;
        }catch(err){
            throw new Error("invalid token");

        }
       
    }

}
