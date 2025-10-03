import { JSX } from "react";
import { Table } from "react-bootstrap";
import { getMatchUrl, getTeamSummaryUrl } from "./utils";

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
    if (new Set(rows.map(r => rowKey(r))).size !== rows.length) return ("Internal error building table: Duplicate row keys. Rows: " + rows.map(r => rowKey(r)).join(" ,"))

    const formatCellData = (data: string, key: string): JSX.Element => {
        if (key === "_team") return <a href={getTeamSummaryUrl(parseInt(data))} target="_blank">{data}</a>;
        if (key === "_match") return <a href={getMatchUrl(parseInt(data))} target="_blank">{data}</a>;
        return <span>{data}</span>;
    };

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
                                    {formatCellData(((row as any)[col.key] ?? 0), col.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
