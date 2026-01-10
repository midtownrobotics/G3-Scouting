import { Button, Card } from "react-bootstrap";
import { fetchAPIJSON } from "../../../API";
import { Item } from "@shared/schemas/game";

interface LootBoxCardProps {
    lootBoxId: number;
    name: string;
    cost: number;
}

export default function LootBoxCard (props: LootBoxCardProps) {
    const handlePurchaseRequest = async () => {
        const item = await fetchAPIJSON(`/game/lootboxes/openLootbox/${props.lootBoxId}`, Item);
        console.log(item?.name);
    };


    return (
        <Card style={{ width: '18rem'}}>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <br></br>
                <Button onClick={handlePurchaseRequest}>Buy Now! {props.cost} tokens</Button>
            </Card.Body>
        </Card>
    );
}