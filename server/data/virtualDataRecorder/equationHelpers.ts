import { DataType, Equation, EquationComponentType } from "@shared/schemas/virtualDataRecorder";

export function equationNeedsCalculateOtf(equation: Equation) {
    for (const component of equation) {
        if (component.componentType === EquationComponentType.DATA && component.data.type === DataType.SOM_TEAM_AVG) return true;
    }
    return false;
}