import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
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

    return (
        <div id="forms-mainpage">
            <h1>Select a form</h1>
            {
                forms?.map((f, fi) => (
                    <div id="formSelector" key={fi}>
                        <Button variant="link" onClick={() => setFormId(f.id)}>
                            {f.name}
                        </Button>
                        <br />
                    </div>
                ))
            }
        </div>
    )
}

export default MainPage;