import { useEffect, useState } from "react"

function EditableCell({ isEditing, children, onchange, checkbox, submit }: { checkbox?: boolean, isEditing?: boolean, children?: string | number | boolean, onchange: (val: string | boolean) => void, submit?: () => void }) {
    const [editable, setEditable] = useState(true)

    useEffect(() => {
        setEditable(isEditing === undefined ? true : isEditing)
    }, [isEditing])

    return (
        <td>
            {
                checkbox ? (
                    <input
                    className="form-check-input"
                        type="checkbox"
                        style={{ 
                            backgroundColor: Boolean(children) ? (editable ? " #d66a6a" : "rgb(116, 31, 31)") : (editable ? " #6a9bd6" : "rgb(27, 43, 130)"), 
                            pointerEvents: editable ? "all" : "none",
                            border: "none",
                            width: "30px"
                        }}
                        onChange={(e) => { if (editable) onchange(e.target.checked)}}
                        checked={Boolean(children)}
                    />
                ) : (
                    editable ? (
                        <input
                            type="text"
                            onChange={(e) => onchange(e.target.value)}
                            defaultValue={children?.toString()}
                            onKeyUp={(e) => {
                                if (e.key == "Enter" && submit) {
                                    submit()
                                }
                            }}
                        />
                    ) : (
                        children?.toString()
                    )
                )
            }
        </td>
    )
}

export default EditableCell;