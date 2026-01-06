export default function getTokensFromAccuracy(accuracyScore: number): number {
    return (Math.max(Math.round(1-(accuracyScore/100))*40), 0);
}