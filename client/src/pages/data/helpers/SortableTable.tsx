import { JSX } from "react";
import { Table } from "react-bootstrap";
import { getMatchUrl, getTeamSummaryUrl } from "./utils";

interface Props<T> {
    columns: (boolean | { key: string; label: string; })[];
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
    if (new Set(rows.map(r => rowKey(r))).size !== rows.length) return (<h3>{"Internal error building table: Duplicate row keys. Rows: " + rows.map(r => rowKey(r)).join(" ,")}</h3>)
    const visibleColumns = columns.filter(col => typeof col !== "boolean");

    const formatCellData = (data: string, key: string): JSX.Element => {
        if (key === "_team") return <a href={getTeamSummaryUrl(parseInt(data))} >{data}</a>;
        if (key === "_match") return <a href={getMatchUrl(parseInt(data))} >{data}</a>;
        return <span>{data}</span>;
    };

    return (
        <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <Table bordered hover size="sm" className="mb-0">
                <thead className="sticky-top bg-white shadow-sm">
                    <tr>
                        <th></th>
                        {visibleColumns.map(col => (
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
                    {rows.map((row, i) => (
                        <tr key={rowKey(row)}>
                            <td>{i+1}</td>
                            {visibleColumns.map(col => (
                                <td key={col.key} style={{ verticalAlign: "middle", whiteSpace: "nowrap" }}>
                                    {formatCellData(((row as any)[col.key] ?? ""), col.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
