import { closestCenter, DndContext, DragMoveEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Form from "@shared/forms/Form";
import { FormComponent as FormComponentClass } from "@shared/forms/FormComponents";
import { useReducer, useRef, useState } from "react";
import { Alert, Button, Card, Col, FormControl, InputGroup, Row } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { postAPI } from "../../API";
import FormComp from "../../partials/FormComp";
import NewComponent from "./components/NewComponent";
import SelectForm from "./SelectForm";
import SortableItem from "./SortableItem";

export default function FormMaker() {
    const form = useRef<Form | undefined>(undefined);

    const updateReducer = useReducer(x => x + 1, 0);
    const forceUpdate = () => {
        updateReducer[1]();
        setFormDescription(form.current?.description ?? "");
    };

    const [newComponentsTop, setNewComponentsTop] = useState<boolean>(false);
    const [newFormName, setNewFormName] = useState("");
    const [formDescription, _setFormDescription] = useState(form.current?.description);
    const [saving, setSaving] = useState(false);
    const [savingMsg, setSavingMsg] = useState<string>();
    const [savingErr, setSavingErr] = useState(false);

    const [dragging, setDragging] = useState<string>("");
    const [items, setItems] = useState<string[]>([]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (form.current === undefined) {
        return <SelectForm form={form} forceUpdate={forceUpdate} setItems={setItems} />;
    }

    function setFormDescription(description: string) {
        _setFormDescription(description);
        if (form.current !== undefined) form.current.description = description;
    }

    function handleDragEnd() {
        setDragging("");
        const components = form.current?.getComponents() ?? [];
        const ids = components.map(c => c.getId());
        setItems(ids);
        forceUpdate();
    }

    function handleDragMove(event: DragMoveEvent) {
        const { active, over } = event;
        if (over === null) return;
        const newIndex = items.indexOf(over.id.toString());
        form.current?.moveComponent(active.id.toString(), newIndex);
        forceUpdate();
    }

    function handleAddComponent(component: FormComponentClass): boolean {
        if (form.current === undefined) return false;
        const status = form.current.addComponent(component);

        if (status) {
            if (newComponentsTop) {
                form.current.moveComponent(component.getId(), 0);
                setItems([component.getId(), ...items]);
            } else {
                setItems([...items, component.getId()]);
            };
        };

        forceUpdate();
        return status;
    }

    function handleDeleteComponent(id: string) {
        if (form.current === undefined) return false;
        form.current.removeComponent(id);
        setItems(form.current.getComponents().map(c => c.getId()));
        forceUpdate();
    }

    async function saveForm(newForm: boolean) {
        const currentForm = form.current?.toJSON();
        if (currentForm === undefined) return;

        setSaving(true);

        if (newForm) {
            currentForm.name = newFormName;
            currentForm.id = newFormName;
        }

        const res = await postAPI("/admin/saveForm", { newForm, form: currentForm });
        if (res?.status === 200) {
            try {
                await res.json();
                setSavingErr(true);
                setSavingMsg("Form already exists!");
                setSaving(false);
                return;
            } catch (e) {
                setSavingErr(false);
                setSavingMsg("Success!");
                setSaving(false);
                setTimeout(() => setSavingMsg(undefined), 3000);
                return;
            }
        }

        setSavingErr(true);
        setSavingMsg("Error saving form!");
        setSaving(false);
    }

    return (
        <div id="form-maker">
            <Row>
                <Col className="text-center">
                    <h1>Form Maker</h1>
                    <hr className="my-4" />

                    <Card className="bg-light-subtle m-3">
                        <Card.Body>
                            <div className="d-flex align-items-center">
                                <Button
                                    onClick={() => saveForm(false)}
                                    className="text-nowrap d-flex align-items-center gap-1"
                                    disabled={saving}
                                >
                                    Save
                                </Button>

                                <span className="mx-3">or</span>

                                <InputGroup className="flex-grow-1">
                                    <Button
                                        onClick={() => saveForm(true)}
                                        className="text-nowrap"
                                        disabled={saving}
                                    >
                                        Save as new
                                    </Button>
                                    <FormControl
                                        onChange={(e) => setNewFormName(e.target.value)}
                                        type="text"
                                        placeholder="Form Name"
                                        value={newFormName}
                                        disabled={saving}
                                    />
                                </InputGroup>
                            </div>

                            {savingMsg && (
                                <Alert className="mt-3 mb-0 p-1" variant={savingErr ? "danger" : "success"}>
                                    {savingMsg}
                                </Alert>
                            )}

                            <InputGroup className="mt-3">
                                <InputGroupText>Description</InputGroupText>
                                <FormControl
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                />
                            </InputGroup>
                        </Card.Body>
                    </Card>

                    <NewComponent addComponent={handleAddComponent} />

                    <Card className="bg-light-subtle mx-3">
                        <Card.Body>
                            <span>
                                <span>New components will be added to the </span>
                                <select
                                    value={newComponentsTop ? "top" : "bottom"}
                                    onChange={(e) => setNewComponentsTop(e.target.value === "top")}
                                >
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                                <span> of the form.</span>
                            </span>
                            <br />
                            <span>Right click to delete components.</span>
                        </Card.Body>
                    </Card>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                        onDragStart={(e) => setDragging(e.active.id.toString())}
                        onDragOver={handleDragMove}
                    >
                        <SortableContext
                            items={items}
                            strategy={verticalListSortingStrategy}
                        >
                            {items.map(id =>
                                <SortableItem
                                    deleteFn={() => handleDeleteComponent(id)}
                                    key={id}
                                    id={id}
                                    component={form.current?.getComponent(id)}
                                />
                            )}
                        </SortableContext>
                    </DndContext>
                </Col>

                <Col xs="auto" className="d-flex justify-content-center">
                    <div
                        style={{
                            width: "1px",
                            backgroundColor: "#8c8d8e",
                            height: "100%",
                        }}
                    />
                </Col>

                <Col className="text-center">
                    <h1>Preview: {form.current.name}</h1>

                    <FormComp
                        answers={new Map()}
                        handleAnswerChange={() => undefined}
                        form={form.current}
                        match={67}
                        team={1648}
                        teams={[999, 1648, 123]}
                        dragging={dragging}
                    />

                </Col>
            </Row>
        </div>
    );
}