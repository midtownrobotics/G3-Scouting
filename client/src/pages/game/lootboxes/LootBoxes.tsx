import { useEffect, useState } from "react";
import LootBoxCard from "./LootBoxCard";
import { Lootbox } from "@shared/schemas/game";
import { fetchZod } from "../../../utils";
import { Container } from "react-bootstrap";


export default function LootBoxes() {
    const [lootBoxes, setLootBoxes] = useState<Lootbox[] | null>();

    useEffect(() => {
        fetchZod("/api/game/lootboxes/getLootBoxData", Lootbox.array())
            .then(setLootBoxes)
            .catch(console.error);
    }, [])
    

    if (!lootBoxes) return (<div><h3>Lootboxes</h3>
                              <h4>Loading...</h4></div>);

    return (
        <div>
            <h3>Lootboxes</h3>
            <Container>
                {lootBoxes?.map(lb => (
                    <LootBoxCard name={lb.name} cost={lb.cost}/>
                ))}
            </Container>
        </div>        
    );
}