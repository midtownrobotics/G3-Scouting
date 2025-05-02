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
                        type="checkbox"
                        onChange={(e) => onchange(e.target.checked)}
                        checked={Boolean(children)}
                        disabled={!editable}
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