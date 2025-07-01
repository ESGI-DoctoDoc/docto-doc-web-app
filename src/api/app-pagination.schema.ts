import {z} from "zod"

export const appPaginationSchema = z.object({
    size: z.number().optional(),
    page: z.number().optional(),
})