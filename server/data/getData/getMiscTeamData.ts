import { MiscTeamData } from "@shared/schemas/data";
import { getTeamData as getSbTeamData } from "server/externalApis/statbotics/statbotics";
import { getTeamMedia, getTeamData as getTbaTeamData } from "server/externalApis/tba/tba";

export default async function getMiscTeamData(team: number): Promise<MiscTeamData | undefined> {
    const sbData = await getSbTeamData(team);
    const mediaData = await getTeamMedia(team);
    const tbaData = await getTbaTeamData(team);
    if (!sbData || !tbaData) return undefined;
    
    const avatar = mediaData?.find(md => md.type === "avatar")?.details.base64Image

    return {
        record: { ...sbData.record },
        rank: sbData.district_rank,
        rp: sbData.district_points,
        epa: sbData.epa.breakdown.total_points,
        avatarBase64: avatar,
        nickname: tbaData.nickname,
        fullName: tbaData.name,
        team
    }
}