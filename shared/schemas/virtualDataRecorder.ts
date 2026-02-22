import z from "zod";

export enum EquationComponentType {
    OPERATOR = "OPERATOR",
    DATA = "DATA",
    CONSTANT = "CONSTANT"
}

export enum Operator {
    MULTIPLY = "MULTIPLY",
    DIVIDE = "DIVIDE",
    ADD = "ADD",
    SUBTRACT = "SUBTRACT",
    EXPONENT = "EXPONENT",
    END = "END"
}

export enum DataType {
    TBA_TEAM = "TBA_TEAM",
    TBA_MATCH = "TBA_MATCH",
    STATBOTICS_TEAM = "STATBOTICS_TEAM",
    STATBOTICS_MATCH = "STATBOTICS_MATCH",
    SOM_TEAM_AVG = "SOM_TEAM_AVG",
    SOM_MATCH_TEAM = "SOM_MATCH_TEAM",
    SOM_MATCH_ALLIANCE = "SOM_MATCH_ALLIANCE"
}

export const Data = z.object({
    type: z.nativeEnum(DataType),
    path: z.string()
});
export type Data = z.infer<typeof Data>;

export const EquationComponent = z.discriminatedUnion("componentType", [
    z.object({
        componentType: z.literal(EquationComponentType.OPERATOR),
        operator: z.nativeEnum(Operator)
    }),
    z.object({
        componentType: z.literal(EquationComponentType.DATA),
        data: Data
    }),
    z.object({
        componentType: z.literal(EquationComponentType.CONSTANT),
        value: z.number()
    })
]);
export type EquationComponent = z.infer<typeof EquationComponent>;

export const Equation = z.array(EquationComponent);
export type Equation = z.infer<typeof Equation>;