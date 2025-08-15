import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { fetchAPIJSON } from "../../../API";
import "./MainPage.css";

function MainPage({ setFormId }: { setFormId: (id: string) => void; }) {
    const [forms, setForms] = useState<SerializedForm[]>();

    useEffect(() => {
        fetchAPIJSON("/forms/getForms", SerializedForm.array()).then(res => {
            if (res) {
                setForms(res.filter(f => f.deployed));
            }
        });
    }, []);

    return !forms ? (
        <h1>Loading Forms <Spinner></Spinner></h1>
    ) : (
        <Container className="mt-4">
            <h2 className="mb-4">Select a Form</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {forms.map((form, idx) => (
                    <Col key={idx}>
                        <Card
                            onClick={() => setFormId(form.id)}
                            className="h-100 shadow-sm hover-shadow transition card-hover"
                            style={{ cursor: "pointer" }}
                        >
                            <Card.Body>
                                <Card.Title>{form.name}</Card.Title>
                                <Card.Text>{form.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MainPage;