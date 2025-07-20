import { Table } from "react-bootstrap";

interface Props<T> {
    columns: { key: string; label: string; }[];
    rows: T[];
    sortKey: string | null;
    sortAsc: boolean;
    onSort: (key: string) => void;
    rowKey: (row: T) => string | number;
}

export function SortableTable<T>({
    columns,
    rows,
    sortKey,
    sortAsc,
    onSort,
    rowKey,
}: Props<T>) {
    return (
        <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Table bordered hover size="sm" className="mb-0">
                <thead className="sticky-top bg-white shadow-sm">
                    <tr>
                        {columns.map(col => (
                            <th
                                key={col.key}
                                onClick={() => onSort(col.key)}
                                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
                            >
                                {col.label}
                                {sortKey === col.key && (sortAsc ? " ▲" : " ▼")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={rowKey(row)}>
                            {columns.map(col => (
                                <td key={col.key} style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                                    {(row as any)[col.key] ?? 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
