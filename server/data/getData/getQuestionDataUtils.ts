import { QuestionMetadata } from "@shared/schemas/data";

type StringAggregation = { values: Map<string, number>, responses: { response: string, match: number; }[]; };
type NumberAggregation = { sum: number, count: number, responses: { response: string, match: number; }[]; };
export type AggregationEntry = StringAggregation | NumberAggregation;

/** Compute averages */
export function computeAverage(metadata: QuestionMetadata, data: AggregationEntry): string | number {
    if (metadata.type === "string" && "values" in data) {
        const values = Array.from(data.values.entries());
        const mostCommon = values.sort((a, b) => b[1] - a[1])[0];
        const total = values.reduce((sum, [, count]) => sum + count, 0);
        const percent = total ? Math.round((mostCommon[1] / total) * 100) : 0;
        return `${mostCommon[0]} - ${percent}%`;
    } else if ("sum" in data) {
        return data.count === 0 ? 0 : data.sum / data.count;
    }
    return "";
}

/** Aggregate a single response */
export function aggregateResponse(
    aggregation: Map<string, AggregationEntry>,
    metadataMap: Map<string, QuestionMetadata>,
    namespacedId: string,
    response: string,
    match: number
) {
    const key = namespacedId;
    const metadata = metadataMap.get(key);
    if (!metadata) return;

    if (metadata.type === "string") {
        const entry = aggregation.get(key) ?? { values: new Map<string, number>(), responses: [] };
        if ("values" in entry) {
            entry.values.set(response, (entry.values.get(response) ?? 0) + 1);
            entry.responses.push({ response, match });
            aggregation.set(key, entry);
        }
    } else {
        const value = parseFloat(response);
        if (isNaN(value)) return;
        const entry = aggregation.get(key) ?? { sum: 0, count: 0, responses: [] };
        if ("sum" in entry) {
            entry.sum += value;
            entry.count += 1;
            entry.responses.push({ response, match });
            aggregation.set(key, entry);
        }
    }
}
