import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import z from 'zod';
import { fetchAPIJSON } from "../../../API";
import "./MainPage.css";

function MainPage({ setFormId }: { setFormId: (id: string) => void }) {
    const [forms, setForms] = useState<SerializedForm[]>()

    useEffect(() => {
        fetchAPIJSON("/forms/getForms").then(u => {
            const parsed = z.array(SerializedForm).safeParse(u)
            if (parsed.success && parsed.data) {
                setForms(parsed.data)
            }
        })
    }, [])

    return !forms ? (
        <h1>Loading Forms <Spinner></Spinner></h1>
    ) : (
        <Container className="mt-4">
            <h2 className="mb-4">Select a Form</h2>
            <Row xs={1} md={2} lg={3} className="g-4">
                {forms.map((form, idx) => (
                    <Col key={idx}>
                        <Card
                            className="h-100 shadow-sm border-light"
                            style={{
                                backgroundColor: "white",
                                transition: "0.2s",
                            }}
                        >
                            <Card.Body>
                                <Card.Title className="d-flex justify-content-between align-items-start">
                                    {form.name}
                                </Card.Title>
                                <Card.Text className="text-muted">{form.description}</Card.Text>
                                <Button variant="outline-primary" onClick={() => setFormId(form.id)}>
                                    Open
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default MainPage;