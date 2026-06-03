import {z} from "zod";

export const createFormInput = z.object({
    title: z.string().max(50).describe("title of the form"),
    description: z.string().max(300).optional().describe("description of the form"),
    createdBy: z.uuid().describe("uuid of the creator"),

})

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormsByUserIdInput = z.object({
    userId: z.uuid().describe("UUID of the user"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;