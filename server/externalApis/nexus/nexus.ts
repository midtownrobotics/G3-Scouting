import path from 'path';
import { getSettingsValue } from "../../settings";
import { NexusEventStatus } from '@shared/schemas/pit';

async function fetchNexus(url: string) {
    const key = await getSettingsValue("nexus");

    return (await fetch(
        ("https://" + path.join("frc.nexus/api/v1/", url)),
        {
            method: "GET",
            headers: {
                "Nexus-Api-Key": key
            }
        }
    ));
}

export async function getEventStatus() {
    // const event = await getSettingsValue("eventKey");
    const event = "2025gagai1";
    const fetched = await fetchNexus(`/event/${event}`);
    console.log(fetched)
    if (!fetched) return undefined;
    const data = NexusEventStatus.safeParse(await fetched.json());
    if (data.success) return data.data;
    return undefined;
}