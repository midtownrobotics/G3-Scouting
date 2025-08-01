import Form from "@shared/forms/Form";
import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Alert, Form as BSForm, Button, Col, FormControl, Row, Table } from "react-bootstrap";
import { CloudSlash, CloudUpload, Pencil, Trash } from "react-bootstrap-icons";
import { z } from "zod";
import { fetchAPIJSON, postAPI } from "../../API";

export default function SelectForm({
    form,
    forceUpdate,
    setItems
}: {
    form: React.RefObject<Form | undefined>,
    forceUpdate: () => void,
    setItems: (i: string[]) => void;
}) {
    const [forms, setForms] = useState<SerializedForm[]>();
    const [newFormName, setNewFormName] = useState("");
    const [newFormDesc, setNewFormDesc] = useState("");

    const [working, setWorking] = useState(false);

    const [err, setErr] = useState<string>();

    const getForms = () => {
        fetchAPIJSON("/forms/getForms").then(u => {
            const parsed = z.array(SerializedForm).safeParse(u);
            if (parsed.success && parsed.data) {
                setForms(parsed.data);
            }
        });
    };

    useEffect(() => getForms, []);

    const createNewForm = () => {
        setErr(undefined);
        const newForm = new Form(newFormName.trim(), newFormDesc.trim());
        if (forms?.some(f => f.id === newForm.id)) return setErr("ERROR: Form already exists.");
        form.current = newForm;
        form.current.deployed = false;
        forceUpdate();
    };

    const editForm = (id: string) => {
        const thisForm = forms?.find(f => f.id === id);
        if (thisForm === undefined) return;
        form.current = Form.fromJSON(thisForm);
        setItems(form.current.getComponents().map(c => c.getId()));
        forceUpdate();
    };

    const setDeployed = async (id: string, deployed: boolean) => {
        setWorking(true);
        await postAPI("/admin/setDeployed", { form: id, deployed });
        await new Promise((r) => setTimeout(r, 200));
        getForms();
        setWorking(false);
    };

    const deleteForm = async (id: string, name: string) => {
        if (!confirm(`You are about to delete "${name}".`)) return;
        if (prompt(`Please type "I am about to delete ${name}" in the box.`) !== `I am about to delete ${name}`) return;
        await postAPI("/admin/deleteForm", { form: id });
        await new Promise((r) => setTimeout(r, 200));
        getForms();
        setWorking(false);
    };

    return (
        <div>
            <Row className="text-center">
                <Col className="m-2">
                    <h3>Manage current forms:</h3>
                    <Table
                        style={{
                            minWidth: "300px",
                            maxWidth: "600px",
                            margin: "auto",
                            borderRadius: "0.5rem",
                            overflow: "hidden",
                        }}
                        className="m-auto"
                    >
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th />
                                <th />
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {forms?.map(f =>
                                <tr key={f.id}>
                                    <td className="align-middle text-center">
                                        <span className="m-auto">{f.name}</span>
                                    </td>
                                    <td>
                                        <Button
                                            variant="link"
                                            title="Edit"
                                            onClick={() => editForm(f.id)}
                                            disabled={working}
                                        >
                                            <Pencil />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="link"
                                            title={f.deployed ? "Undeploy" : "Deploy"}
                                            onClick={() => setDeployed(f.id, !f.deployed)}
                                            disabled={working}
                                        >
                                            {f.deployed ? <CloudSlash /> : <CloudUpload />}
                                        </Button>
                                    </td>
                                    <td>
                                        {!f.deployed &&
                                            <Button
                                                variant="link"
                                                title="Delete"
                                                onClick={() => deleteForm(f.id, f.name)}
                                                disabled={working}
                                            >
                                                <Trash />
                                            </Button>
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Col >

                <Col className="m-2">
                    <h3>Create new form:</h3>
                    <BSForm
                        className="d-flex flex-column align-items-center gap-2"
                        style={{
                            minWidth: "300px",
                            maxWidth: "600px",
                        }}
                    >
                        <FormControl
                            onChange={(e) => setNewFormName(e.target.value.trimStart())}
                            value={newFormName}
                            placeholder="Form name..."
                        />
                        <FormControl
                            onChange={(e) => setNewFormDesc(e.target.value.trimStart())}
                            value={newFormDesc}
                            placeholder="Form description..."
                        />
                        <Button
                            className="w-100"
                            variant="primary"
                            onClick={createNewForm}
                            disabled={newFormDesc === "" || newFormName === ""}
                        >Submit</Button>
                    </BSForm>
                    {err && <Alert className="my-2 p-2" variant="danger">{err}</Alert>}
                </Col>
            </Row >
        </div>
    );
}