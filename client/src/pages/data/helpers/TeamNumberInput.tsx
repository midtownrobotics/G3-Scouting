import { TeamData } from "@shared/schemas/data";
import { useEffect, useState } from "react";
import { FormControl, InputGroup, ListGroup } from "react-bootstrap";
import { fetchAPIJSON } from "../../../API";
import { z } from "zod";

type TeamNumberInputProps = {
    onChange: (number: number) => void;
    queryKey?: string;
};

export default function TeamNumberInput({ onChange, queryKey = "team" }: TeamNumberInputProps) {
    const [teams, setTeams] = useState<TeamData[]>([]);
    const [val, setVal] = useState<string>("");
    const [suggestions, setSuggestions] = useState<{data: TeamData, suggestion: string}[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const saveToUrl = (v: number) => {
        const url = new URL(window.location.href);
        url.searchParams.set(queryKey, v.toString());
        window.history.pushState({}, "", url.toString());
    }

    useEffect(() => {
        const team = new URLSearchParams(window.location.search).get(queryKey);
        if (team && !Number.isNaN(parseInt(team))) {
            onChange(parseInt(team));
            setVal(team);
        }

        fetchAPIJSON("/data/getAllTeams", z.array(TeamData)).then(res => {
            if (res) setTeams(res);
        })
    }, []);

    const handleChange = (v: string) => {
        setVal(v);

        if (v.length > 0) {
            const newSuggestions: typeof suggestions = [];
            teams.forEach(t => {
                if (t.name.toLowerCase().startsWith(v.toLowerCase())) newSuggestions.push({ data: t, suggestion: t.name });
                if (t.number.toString().startsWith(v)) newSuggestions.push({ data: t, suggestion: t.number.toString() });
            });
            setSuggestions(newSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        let team: TeamData | undefined;
        if (!Number.isNaN(parseInt(v))) {
            team = teams.find(t => t.number === parseInt(v));
        } else {
            team = teams.find(t => t.name.toLowerCase() === v.toLowerCase());
        }
        
        if (team) {
            onChange(team.number);
            saveToUrl(team.number);
        }
    };

    const handleSelect = (team: TeamData) => {
        setVal(team.number.toString());
        setSuggestions([]);
        setShowSuggestions(false);
        onChange(team.number);
        saveToUrl(team.number);
    };

    return (
        <div className="mb-3" style={{ position: "relative", maxWidth: "300px" }}>
            <InputGroup className="mb-0">
                <FormControl
                    placeholder="Team Name/Number"
                    aria-label="Team Name/Number"
                    value={val}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onFocus={() => val && setShowSuggestions(true)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSelect(suggestions[0].data); }}
                />
            </InputGroup>

            {showSuggestions && suggestions.length > 0 && (
                <ListGroup
                    style={{
                        position: "absolute",
                        zIndex: 1000,
                        width: "100%",
                        maxHeight: "200px",
                        overflowY: "auto",
                    }}
                >
                    {suggestions.map((s) => (
                        <ListGroup.Item
                            action
                            key={s.data.number}
                            onClick={() => handleSelect(s.data)}
                        >
                            {s.suggestion}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}