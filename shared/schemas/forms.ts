import { FormType } from '@shared/forms/Form';
import z from 'zod';
import formComponents from '../forms/FormComponents';
import { FormResponse } from './data';

export const SerializedComponent = z.object({
    type: z.enum(Object.keys(formComponents) as [keyof typeof formComponents, ...(keyof typeof formComponents)[]]),
    id: z.string(),
    creationArgs: z.array(z.any())
});
export type SerializedComponent = z.infer<typeof SerializedComponent>;

export const SerializedForm = z.object({
    type: z.nativeEnum(FormType),
    responses: z.array(FormResponse).optional(),
    name: z.string(),
    id: z.string(),
    description: z.string(),
    deployed: z.boolean(),
    maxComponentId: z.number(),
    components: z.array(SerializedComponent),
});
export type SerializedForm = z.infer<typeof SerializedForm>;