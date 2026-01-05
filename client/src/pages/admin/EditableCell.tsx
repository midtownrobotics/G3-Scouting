import { Permission } from "@shared/permissions";
import { useEffect, useState } from "react";

function EditableCell({ isEditing, children, onchange, checkbox, submit }: { checkbox?: boolean, isEditing?: boolean, children?: string | number | boolean | null, onchange: (val: string | boolean) => void, submit?: () => void; }) {
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

export function EditablePermissionCell({ isEditing, children, onChange }: {isEditing?: boolean, children?: string, onChange: (val: string) => void }) {
    return (
        <td>
            <select 
                disabled={!isEditing}
                value={children}
                onChange={e => onChange(e.target.value)}
            >
                {Object.values(Permission).map(v => 
                    <option value={v}>{v}</option>
                )}
            </select>
        </td>
    )
}