import Form, { FormType } from "@shared/forms/Form";
import { SerializedForm } from "@shared/schemas/forms";
import { useEffect, useState } from "react";
import { Alert, Form as BSForm, Button, Col, FormControl, Row, Table } from "react-bootstrap";
import { CloudSlash, CloudUpload, Lock, Pencil, Trash, Unlock } from "react-bootstrap-icons";
import { fetchAPIJSON, postAPI } from "../../API";

function isFormTypeKey(val: string): val is keyof typeof FormType {
    return val in FormType;
}

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
    const [newFormType, _setNewFormType] = useState<FormType>(FormType.TEAM);

    const setNewFormType = (val: string) => {
        if (isFormTypeKey(val)) _setNewFormType(FormType[val]);
    };

    const [working, setWorking] = useState(false);

    const [err, setErr] = useState<string>();

    const getForms = (next?: () => void) => {
        fetchAPIJSON("/forms/getForms", SerializedForm.array()).then(res => {
            if (res) {
                setForms(res);
                if (next) next();
            }
        });
    };

    useEffect(() => getForms(), []);

    const createNewForm = () => {
        setErr(undefined);

        const newForm = new Form(newFormType, newFormName, newFormDesc);

        if (forms?.some(f => f.id === newForm.id)) return setErr("ERROR: Form already exists.");
        form.current = newForm;
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
        getForms(() => setWorking(false));
    };

    const setOpenSubmission = async (id: string, openSubmission: boolean) => {
        setWorking(true);
        await postAPI("/admin/setOpenSubmission", { form: id, openSubmission });
        await new Promise((r) => setTimeout(r, 200));
        getForms(() => setWorking(false));
    };

    const deleteForm = async (id: string, name: string) => {
        if (!confirm(`You are about to delete "${name}".`)) return;
        if (prompt(`Please type "I am about to delete ${name}" in the box.`) !== `I am about to delete ${name}`) return;
        await postAPI("/admin/deleteForm", { form: id });
        await new Promise((r) => setTimeout(r, 200));
        getForms(() => setWorking(false));
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
                                        <Button
                                            variant="link"
                                            title={f.openSubmission ? "Lock Submissions" : "Unlock Submissions"}
                                            onClick={() => setOpenSubmission(f.id, !f.openSubmission)}
                                            disabled={working}
                                        >
                                            {f.openSubmission ? <Lock /> : <Unlock />}
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
                        className="d-flex flex-column align-items-center gap-2 m-auto"
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
                        <BSForm.Select onChange={(e) => setNewFormType(e.target.value)}>
                            <option value="TEAM">Team Based</option>
                            <option value="ALLIANCE">Alliance Based</option>
                            <option value="NO_MATCH">Team Data (no match)</option>
                        </BSForm.Select>
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