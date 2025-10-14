export default function getTokensFromAccuracy(accuracyScore: number | null | undefined): number {
    if (accuracyScore == null) return 0;
    if (accuracyScore <= 45) return 0;
    if (accuracyScore <= 55) return 5;
    if (accuracyScore <= 65) return 10;
    if (accuracyScore <= 75) return 20;
    if (accuracyScore <= 85) return 30;
    if (accuracyScore <= 90) return 35;
    return 40;
}