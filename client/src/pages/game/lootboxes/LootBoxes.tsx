import { useEffect, useState } from "react";
import LootBoxCard from "./LootBoxCard";
import { Lootbox } from "@shared/schemas/game";
import { fetchZod } from "../../../utils";
import { Col, Row } from "react-bootstrap";


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
            <Row className="gy-3 gx-0">
                {lootBoxes.map(lb => (
                    <Col key={lb.id} xs={6} sm={3} md={4} lg={3}>
                        <LootBoxCard lootBoxId={lb.id} name={lb.name} cost={lb.cost} />
                    </Col>
                ))}
            </Row>
        </div>        
    );
}