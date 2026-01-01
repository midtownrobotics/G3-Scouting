import { Alliance } from "@shared/utils";
import { FormType as FormTypeEnum } from "../forms/Form";
import { z } from "zod";

export const FormType = z.nativeEnum(FormTypeEnum);

/** A question: response pair. Contains the **NON-NAMESPACED** questionId and a response. */
export const QuestionResponse = z.object({
    question: z.string(),
    response: z.string()
});
export type QuestionResponse = z.infer<typeof QuestionResponse>;

/** A response to a form, including a team, match, and the question: response pairs. If sent from the server, will contain `userId`, `submittedAt`, `id`, and `accuracyScore`. */
export const FormResponse = z.object({
    team: z.number(),
    responses: z.array(QuestionResponse),
    match: z.number().optional(),
    formId: z.string(),
    userId: z.number().optional(),
    submittedAt: z.string().optional(),
    id: z.number().optional(),
    accuracyScore: z.number().nullish()
});
export type FormResponse = z.infer<typeof FormResponse>;

/** A response that is sent from the client to the server. */
export const SubmittedResponse = z.union([
    z.object({
        type: z.literal(FormTypeEnum.TEAM),
        response: FormResponse
    }),
    z.object({
        type: z.literal(FormTypeEnum.ALLIANCE),
        teams: z.array(z.number()),
        responses: z.array(FormResponse)
    }),
]).and(z.object({
    formId: z.string()
}));
export type SubmittedResponse = z.infer<typeof SubmittedResponse>;

/** Data about how to validate question data. */
export const QuestionValidationData = z.object({
    type: z.literal("tba"),
    path: z.string()
});
export type QuestionValidationData = z.infer<typeof QuestionValidationData>;

/** Metadata for form questions. */
export const QuestionMetadata = z.union([
    z.object({
        name: z.string(),
        id: z.string(),
        formId: z.string(),
        formType: FormType,
        namespaceId: z.string(),
        type: z.enum(["string", "number"]),
        classification: z.enum(["qualitative", "quantitative"])
    }),
    z.object({
        name: z.string(),
        id: z.string(),
        formId: z.string(),
        formType: FormType,
        namespaceId: z.string(),
        type: z.literal("number"),
        classification: z.literal("quantitative"),
        validation: QuestionValidationData
    })
]);
export type QuestionMetadata = z.infer<typeof QuestionMetadata>;

/** Contains information about the form responses including the form id, the questions, and the responses themselves. */
export const FormResponseData = z.object({
    formId: z.string(),
    formType: FormType,
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
        scout: z.number(),
        match: z.number().optional()
    })),
});
export type QuestionData = z.infer<typeof QuestionData>;

/** Data about a question, including its responses and average for multiple teams. */
export const MultiTeamQuestionData = z.object({
    metadata: QuestionMetadata,
    stats: z.object({
        percentile25: z.number().nullish(),
        percentile50: z.number().nullish(),
        percentile75: z.number().nullish(),
        totalAverage: z.number().nullish(),
        maxAverage: z.object({
            average: z.number(),
            team: z.number()
        }).optional(),
    }),
    teamData: z.array(z.object({
        questionData: QuestionData,
        team: z.number()
    }))
});
export type MultiTeamQuestionData = z.infer<typeof MultiTeamQuestionData>;

export const NextMatch = z.object({
    number: z.number(),
    team: z.number(),
    teams: z.array(z.number()),
    finished: z.boolean(),
    alliance: z.nativeEnum(Alliance)
});
export type NextMatch = z.infer<typeof NextMatch>;

/** Info about scout's current assignments. */
export const CurrentAssignment = NextMatch.and(z.object({
    username: z.string(),
    userId: z.number(),
    displayName: z.string().nullish(),
}));
export type CurrentAssignment = z.infer<typeof CurrentAssignment>;

export const MatchData = z.object({
    number: z.number(),
    teams: z.array(z.number()),
    blue: z.array(z.number()),
    red: z.array(z.number()),
})
export type MatchData = z.infer<typeof MatchData>;

export const ExtendedMatchData = MatchData.and(z.object({
    winner: z.enum(["red", "blue", ""]).nullish(),
    score: z.object({
        red: z.number().nullish(),
        blue: z.number().nullish()
    }),
    posted: z.boolean(),
    time: z.coerce.date().nullish()
}))
export type ExtendedMatchData = z.infer<typeof ExtendedMatchData>;

export const TeamData = z.object({
    number: z.number(),
    name: z.string()
})
export type TeamData = z.infer<typeof TeamData>;

export const MiscTeamData = z.object({
    record: z.object({
        wins: z.number(),
        ties: z.number(),
        losses: z.number(),
        count: z.number(),
        winrate: z.number()
    }),
    rank: z.number(),
    rp: z.number(),
    epa: z.number(),
    avatarBase64: z.string().optional(),
    nickname: z.string(),
    fullName: z.string(),
    team: z.number()
})
export type MiscTeamData = z.infer<typeof MiscTeamData>;

export const SaveableInputData = z.object({
    value: z.string()
});
export type SaveableInputData = z.infer<typeof SaveableInputData>;

export const PickListItem = z.object({
    teamNumber: z.number(),
    teamName: z.string(),
    notes: z.string(),
    epa: z.number(),
});
export type PickListItem = z.infer<typeof PickListItem>;

export const ClientToServerMessage = z.object({
    type: z.literal("setPickList"),
    payload: z.object({
        list: z.array(PickListItem),
        id: z.number()
    })
});
export type ClientToServerMessage = z.infer<typeof ClientToServerMessage>;

export const ServerToClientMessage = z.object({
    type: z.literal("ping")
}).or(z.object({
    type: z.literal("getPickList"),
    payload: z.object({
        list: z.array(PickListItem),
        id: z.number()
    })
}));
export type ServerToClientMessage = z.infer<typeof ServerToClientMessage>;