import { Button, Card } from "react-bootstrap";

interface LootBoxCardProps {
    name: string;
    description: string;
    cost: number;
}

export default function LootBoxCard (props: LootBoxCardProps) {
    return (
        <Card style={{ width: '18rem'}}>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Subtitle>{props.description}</Card.Subtitle>
                <br></br>
                <Button>Buy Now! {props.cost} tokens</Button>
            </Card.Body>
        </Card>
    );
}