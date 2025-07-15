import { z } from "zod";

export const FieldResponse = z.object({
    question: z.string(),
    response: z.string()
});
export type FieldResponse = z.infer<typeof FieldResponse>;

export const RowData = z.object({
    fieldResponses: z.array(FieldResponse),
    teamNumber: z.number(),
    matchNumber: z.number()
});
export type RowData = z.infer<typeof RowData>;

export const FormQuestionMeta = z.object({
    name: z.string(),
    type: z.enum(["string", "number"]),
    classification: z.enum(["qualitative", "quantitative", "teamNumber", "matchNumber"]),
});
export type FormQuestionMeta = z.infer<typeof FormQuestionMeta>;

export const FormQuestionMetaWithId = FormQuestionMeta.extend({
    id: z.string(),
});
export type FormQuestionMetaWithId = z.infer<typeof FormQuestionMetaWithId>;

export const FormRowResponse = z.object({
    rows: z.array(RowData),
    questions: z.array(FormQuestionMetaWithId)
});
export type FormRowResponse = z.infer<typeof FormRowResponse>;

export const TeamRowsResponse = z.array(z.object({
    form: z.string(),
    responses: FormRowResponse
}));
export type TeamRowsResponse = z.infer<typeof TeamRowsResponse>;

export const QuestionData = z.object({
    questionMeta: FormQuestionMeta,
    questionId: z.string(),
    questionFormId: z.string(),
    average: z.string().optional(),
    responses: z.array(z.object({
        matchNumber: z.number(),
        response: z.string(),
    })),
});
export type QuestionData = z.infer<typeof QuestionData>;
