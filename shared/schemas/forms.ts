import z from 'zod';
import formComponents from '../forms/FormComponents';

export const SerializedComponent = z.object({
    type: z.enum(Object.keys(formComponents) as [keyof typeof formComponents, ...(keyof typeof formComponents)[]]),
    id: z.string(),
    creationArgs: z.array(z.any())
});
export type SerializedComponent = z.infer<typeof SerializedComponent>;

export const SerializedResponse = z.array(
    z.tuple([
        z.string(),
        z.string()
    ])
);
export type SerializedResponse = z.infer<typeof SerializedResponse>;

export const SerializedForm = z.object({
    name: z.string(),
    id: z.string(),
    description: z.string(),
    deployed: z.boolean(),
    maxComponentId: z.number(),
    components: z.array(SerializedComponent),
    responses: z.array(SerializedResponse).optional()
});
export type SerializedForm = z.infer<typeof SerializedForm>;