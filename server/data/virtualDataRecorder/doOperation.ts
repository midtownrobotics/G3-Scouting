import { Operator } from "@shared/schemas/virtualDataRecorder";

/**
 * Does a specified operation on two numbers. Dividing by zero returns `0`.
 * @param operator The operation to do.
 * @param val1 The first value in the operation. If left blank, value defaults to 0.
 * @param val2 The second value in the operation. If left blank, value defaults to 0.
 * @returns The result of the operation.
 */
export default function (operator: Operator, val1: number = 0, val2: number = 0): number {
    switch (operator) {
        case Operator.ADD:
            return val1 + val2;
        case Operator.SUBTRACT:
            return val1 - val2;
        case Operator.DIVIDE:
            return (val1 / val2) || 0;
        case Operator.MULTIPLY:
            return val1 * val2;
        default:
            return 0;
    }
}