import { Comparative as ComponentComponent } from "@shared/forms/FormComponents";
import { Form } from "react-bootstrap";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from 'react';
import { X } from "react-bootstrap-icons";
import { TEAM_NUMBER_COMPONENT_ID_SEPARATOR } from "@shared/forms/Form"

interface RankingItem {
    id: string;
    team: number;
    rank: number;
}

function SortableRankItem({ item, onRemove }: {
    item: RankingItem;
    onRemove: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="d-flex justify-content-center align-items-center gap-2 mb-2 p-2 bg-light rounded w-md-50 mx-auto form-component"
        >
            <div
                {...attributes}
                {...listeners}
                style={{ cursor: 'grab', touchAction: 'none' }}
                className="d-flex align-items-center gap-2 flex-grow-1"
            >
                <span style={{ minWidth: '30px' }}>
                    #{item.rank}
                </span>
                <span style={{ minWidth: '60px' }}>Team {item.team}</span>
            </div>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                }}
                className="btn btn-sm btn-danger ms-2"
            >
                <X className="fs-5 fw-bold" />
            </button>
        </div>
    );
}

export default function Comparative({
    component,
    onChange,
    teams
}: {
    component: ComponentComponent;
    onChange: (id: string, value: string) => void;
    teams: number[];
}) {
    const [rankedItems, setRankedItems] = useState<RankingItem[]>([]);

    useEffect(() => {
        for (let i = 0; i < rankedItems.length; i++) {
            onChange(`${rankedItems[i].team}${TEAM_NUMBER_COMPONENT_ID_SEPARATOR}${component.getId()}`, rankedItems[i].rank.toString());
        }
    }, [rankedItems]);

    useEffect(() => {
        setRankedItems(teams.map((t, i) => ({
            rank: i + 1,
            team: t,
            id: `team-${t}`
        })))
    }, [teams])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const availableTeams = teams.filter(
        team => !rankedItems.some(item => item.team === team)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setRankedItems((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Recalculate ranks after reordering
                return newItems.map((item, index) => ({
                    ...item,
                    rank: index + 1
                }));
            });
        }
    };

    const handleAddTeam = (team: number) => {
        setRankedItems(items => [
            ...items,
            {
                id: `team-${team}`,
                team,
                rank: items.length + 1
            }
        ]);
    };

    const handleRemoveTeam = (id: string) => {
        setRankedItems(items => {
            const newItems = items.filter(item => item.id !== id);
            // Recalculate ranks after removal
            return newItems.map((item, index) => ({
                ...item,
                rank: index + 1
            }));
        });
    };

    return (
        <Form.Group className="my-3">
            <Form.Label className="fs-2">{component.question}</Form.Label>

            {rankedItems.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={rankedItems.map(i => i.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {rankedItems.map((item) => (
                            <SortableRankItem
                                key={item.id}
                                item={item}
                                onRemove={handleRemoveTeam}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}

            {availableTeams.length > 0 && (
                <div className="mt-3 mx-auto">
                    <Form.Label>Add team to ranking:</Form.Label>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        {availableTeams.map(team => (
                            <button
                                key={team}
                                type="button"
                                onClick={() => handleAddTeam(team)}
                                className="btn btn-primary btn-sm"
                            >
                                + Team {team}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </Form.Group>
    );
}