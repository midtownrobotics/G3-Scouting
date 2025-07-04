import z from 'zod';
import formComponents from '../forms/FormComponents';

export const SerializedComponent = z.object({
    type: z.enum(Object.keys(formComponents) as [keyof typeof formComponents, ...(keyof typeof formComponents)[]]),
    id: z.number().int(),
    creationArgs: z.array(z.any())
});
export type SerializedComponent = z.infer<typeof SerializedComponent>

export const SerializedForm = z.object({
    name: z.string(),
    id: z.string(),
    deployed: z.boolean(),
    components: z.array(SerializedComponent)
})
export type SerializedForm = z.infer<typeof SerializedForm>