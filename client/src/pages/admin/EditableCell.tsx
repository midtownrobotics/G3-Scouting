import { useEffect, useState } from "react";

function EditableCell({ isEditing, children, onchange, checkbox, submit }: { checkbox?: boolean, isEditing?: boolean, children?: string | number | boolean, onchange: (val: string | boolean) => void, submit?: () => void; }) {
    const [editable, setEditable] = useState(true);

    useEffect(() => {
        setEditable(isEditing === undefined ? true : isEditing);
    }, [isEditing]);

    return (
        <td>
            {
                checkbox ? (
                    <input
                        style={{ userSelect: "none" }}
                        type="checkbox"
                        onChange={(e) => { if (editable) onchange(e.target.checked); }}
                        checked={Boolean(children)}
                    />
                ) : (
                    editable ? (
                        <input
                            className="text-center"
                            type="text"
                            onChange={(e) => onchange(e.target.value)}
                            defaultValue={children?.toString()}
                            onKeyUp={(e) => {
                                if (e.key == "Enter" && submit) {
                                    submit();
                                }
                            }}
                        />
                    ) : (
                        children?.toString()
                    )
                )
            }
        </td>
    );
}

export default EditableCell;