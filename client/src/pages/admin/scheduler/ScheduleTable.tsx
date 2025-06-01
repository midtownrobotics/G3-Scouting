import { SimpleUser } from "@shared/schemas/API";
import { Assignment, Block } from "./types";
import { Table } from "react-bootstrap";
import { toFormattedTime } from "./utils";
import UserRow from "./UserRow";
import { useEffect, useRef } from "react";

function ScheduleTable({ users, assignment, blocks }: { users: SimpleUser[], assignment?: Assignment, blocks: Block[] }) {
    const userBlockMapRef = useRef(new Map<number, Map<number, Assignment>>())

    useEffect(() => {
        for (const user of users) {
            if (!userBlockMapRef.current.has(user.id)) {
              userBlockMapRef.current.set(user.id, new Map<number, Assignment>());
            }
          }
    }, [users])

    return (
        <Table bordered>
            <thead>
                <tr>
                    <td></td>
                    {Array.from(
                        blocks.reduce((map, block) => {
                            const date = block.day.date;
                            map.set(date, (map.get(date) || 0) + 1);
                            return map;
                        }, new Map<string, number>())
                    ).map(([date, count], i) => (
                        <td key={i} colSpan={count}>{date}</td>
                    ))}
                </tr>
                <tr>
                    <td></td>
                    {blocks.map((b, bi) => <td key={bi}>{toFormattedTime(b.time)}</td>)}
                </tr>
            </thead>
            <tbody>
                {users.map(u => (
                    <UserRow user={u} assignment={assignment} blocks={blocks} userBlockMapRef={userBlockMapRef} />
                ))}
            </tbody>
        </Table>
    )
}

export default ScheduleTable;