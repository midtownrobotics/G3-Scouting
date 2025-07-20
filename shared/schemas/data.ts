import { z } from "zod";

/** A question: response pair. Contains the **NON-NAMESPACED** questionId and a response. */
export const QuestionResponse = z.object({
    question: z.string(),
    response: z.string()
});
export type QuestionResponse = z.infer<typeof QuestionResponse>;

/** A response to a form, including a team, match, and the question: response pairs. If sent from the server, will contain `userId` and `submittedAt`. */
export const FormResponse = z.object({
    responses: z.array(QuestionResponse),
    formId: z.string(),
    team: z.number(),
    match: z.number(),
    userId: z.number().optional(),
    submittedAt: z.string().optional()
});
export type FormResponse = z.infer<typeof FormResponse>;

/** Data about how to validate question data. */
export const QuestionValidationData = z.object({
    type: z.literal("tba"),
    path: z.string()
})
export type QuestionValidationData = z.infer<typeof QuestionValidationData>;

/** Metadata for form questions. */
export const QuestionMetadata = z.object({
    name: z.string(),
    id: z.string(),
    formId: z.string(),
    namespaceId: z.string(),
    type: z.enum(["string", "number"]),
    classification: z.enum(["qualitative", "quantitative"]),
    validation: QuestionValidationData
});
export type QuestionMetadata = z.infer<typeof QuestionMetadata>;

/** Contains information about the form responses including the form id, the questions, and the responses themselves. */
export const FormResponseData = z.object({
    formId: z.string(),
    responses: z.array(FormResponse),
    questions: z.array(QuestionMetadata)
});
export type FormResponseData = z.infer<typeof FormResponseData>;

/** Data about a question, including its responses, average, and metadata. */
export const QuestionData = z.object({
    metadata: QuestionMetadata,
    average: z.string().or(z.number()).optional(),
    responses: z.array(z.object({
        response: z.string(),
        match: z.number()
    })),
});
export type QuestionData = z.infer<typeof QuestionData>;

/** Data about a question, including its responses and average for multiple teams. */
export const MultiTeamQuestionData = z.object({
    metadata: QuestionMetadata,
    totalAverage: z.number().optional(),
    maxAverage: z.object({
        average: z.number(),
        team: z.number()
    }).optional(),
    teamData: z.array(z.object({
        questionData: QuestionData,
        team: z.number()
    }))
});
export type MultiTeamQuestionData = z.infer<typeof MultiTeamQuestionData>;