import { useEffect, useState } from "react";
import { InputGroup } from "react-bootstrap";
import { Floppy, Pencil } from "react-bootstrap-icons";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { fetchAPIJSON, postAPI } from "../../API";
import { SaveableInputData } from "@shared/schemas/user";

/**
 * A labeled text input that supports editing and saving via API endpoints.
 * 
 * @param props.get The API endpoint to fetch the initial value. Must return `{ value: string }`.
 * @param props.post The API endpoint to save the new value. Must expect `{ value: string }`.
 * @param props.children The label to display above the input field.
 */
function SaveableTextInput({ get, post, children }: { get: string, post: string, children: string }) {
    const [editing, setEditing] = useState(false)
    const [value, setValue] = useState("")

    const reloadValue = () => fetchAPIJSON(get, SaveableInputData).then(res => {
        if (res) {
            setValue(res.value)
        }
    })

    useEffect(() => { reloadValue() }, [])

    const changeEditing = () => {
        setEditing(!editing)

        if (editing) {
            postAPI(post, { value }).then(async r => {
                if (r?.status == 200) reloadValue();
                if (r?.status != 200) {
                    await reloadValue()
                    setEditing(true)
                    alert("Error saving value")
                }
            })
        }
    }

    return (
        <div className="saveableTextInput">
            <label style={{fontSize: "20px"}}>{children}</label>
            <InputGroup>
                <input disabled={!editing} type="text" className="form-control" defaultValue={value} onKeyUp={e => { if (e.key == "Enter") changeEditing() }} onChange={e => setValue(e.target.value)} />
                <InputGroupText id="basic-addon2" onClick={changeEditing}>
                    {editing ? <Floppy /> : <Pencil />}
                </InputGroupText>
            </InputGroup>
        </div>
    )
}

export default SaveableTextInput;