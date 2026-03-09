import { Equation, EquationComponent, EquationComponentType, Operator } from "@shared/schemas/virtualDataRecorder";
import fetchData from "./fetchData";
import doOperation from "./doOperation";
import { getEquationEvaluationExpiry, getEquationEvaluationId } from "./vdrUtils";
import { DateString } from "@shared/types";

const equationCache = new Map<string, { exp: number, evalTime: number, value: number }>();

/**
 * Evaluates an equation by fetching data and performing operations.
 * This uses a simple left-to-right evaluation strategy.
 * @param equation The equation to evaluate.
 * @param team Optional team number for data fetching.
 * @param match Optional match number for data fetching.
 * @returns The result of the equation evaluation, or undefined if evaluation fails.
 */
export async function evaluateEquation(
    equation: Equation,
    team?: number,
    match?: number
): Promise<{ value: number, evalTime: number } | undefined> {
    const cacheValue = equationCache.get(getEquationEvaluationId(equation, match, team))
    if (cacheValue && cacheValue.exp > Date.now()) return cacheValue;

    let accumulator: number = 0;
    let currentOperator: Operator | null = null;

    outerLoop:
    for (const component of equation) {
        switch (component.componentType) {
            case EquationComponentType.CONSTANT: {
                if (currentOperator === null) {
                    // First value in the equation
                    accumulator = component.value;
                } else {
                    // Apply the current operator
                    accumulator = doOperation(currentOperator, accumulator, component.value);
                    currentOperator = null;
                }
                break;
            }

            case EquationComponentType.DATA: {
                const value = await fetchData(component.data, team, match);
                if (value === undefined) {
                    // Data fetch failed, return undefined
                    return undefined;
                }

                if (currentOperator === null) {
                    // First value in the equation
                    accumulator = value;
                } else {
                    // Apply the current operator
                    accumulator = doOperation(currentOperator, accumulator, value);
                    currentOperator = null;
                }
                break;
            }

            case EquationComponentType.OPERATOR: {
                if (component.operator === Operator.END) {
                    break outerLoop;
                }
                currentOperator = component.operator;
                break;
            }
        }
    }

    equationCache.set(getEquationEvaluationId(equation, match, team), { exp: getEquationEvaluationExpiry(equation), value: accumulator, evalTime: Date.now() });

    return { value: accumulator, evalTime: Date.now() };
}

/**
 * Evaluates an equation with operator precedence (multiplication and division before addition and subtraction).
 * @param equation The equation to evaluate.
 * @param team Optional team number for data fetching.
 * @param match Optional match number for data fetching.
 * @returns The result of the equation evaluation, or undefined if evaluation fails.
 */
export async function evaluateEquationWithPrecedence(
    equation: Equation,
    team?: number,
    match?: number
): Promise<number | undefined> {
    // First, resolve all data and constants to values
    const resolvedValues: (number | Operator)[] = [];

    for (const component of equation) {
        switch (component.componentType) {
            case EquationComponentType.CONSTANT:
                resolvedValues.push(component.value);
                break;

            case EquationComponentType.DATA: {
                const value = await fetchData(component.data, team, match);
                if (value === undefined) {
                    return undefined;
                }
                resolvedValues.push(value);
                break;
            }

            case EquationComponentType.OPERATOR:
                if (component.operator === Operator.END) {
                    // Stop processing
                    break;
                }
                resolvedValues.push(component.operator);
                break;
        }
    }

    // Now evaluate with precedence: multiply and divide first
    let values = [...resolvedValues];

    // First pass: handle multiplication and division
    for (let i = 0; i < values.length; i++) {
        const item = values[i];
        if (item === Operator.MULTIPLY || item === Operator.DIVIDE) {
            const left = values[i - 1] as number;
            const right = values[i + 1] as number;
            const result = doOperation(item, left, right);

            // Replace the three elements (left, operator, right) with the result
            values.splice(i - 1, 3, result);
            i--; // Adjust index since we removed elements
        }
    }

    // Second pass: handle addition and subtraction
    for (let i = 0; i < values.length; i++) {
        const item = values[i];
        if (item === Operator.ADD || item === Operator.SUBTRACT) {
            const left = values[i - 1] as number;
            const right = values[i + 1] as number;
            const result = doOperation(item, left, right);

            // Replace the three elements with the result
            values.splice(i - 1, 3, result);
            i--; // Adjust index since we removed elements
        }
    }

    // Should be left with a single number
    return values[0] as number;
}