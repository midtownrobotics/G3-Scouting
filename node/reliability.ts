import schedule from "node-schedule";

const matchesNoData: number[] = []

export const scheduleMatchForReliabilityGrading = (match: number) => matchesNoData.push(match);

schedule.scheduleJob("", () => {
    
})