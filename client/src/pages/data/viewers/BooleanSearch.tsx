import { MultiTeamQuestionData } from "@shared/schemas/data";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { fetchAPIJSON } from "../../../API";
import { Button, FormControl, Container, Row, Col } from "react-bootstrap";
import { makeUrlParam } from "../../../utils";

type SearchCondition = {
    namespaceId: string;
    operator: string;
    value: string;
    appearComparison?: {
        operator: string;
        count: number;
    };
};

type SearchGroup = {
    conditions: SearchCondition[];
    logic: 'AND' | 'OR';
};

export default function BooleanSearch({ accuracy, fromMatch }: { accuracy: number, fromMatch: number }) {
    const [data, setData] = useState<MultiTeamQuestionData[]>();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<number[]>([]);
    const [error, setError] = useState<string>();
    const [numberOfTeams, setNumberOfTeams] = useState(0);

    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const q = new URLSearchParams(window.location.search).get("query")?.toString();
        if (q != null) setQuery(q);
    }, [])

    useEffect(() => executeSearch(), [data]);

    makeUrlParam("query", query);

    useEffect(() => {
        fetchAPIJSON(`/data/getAllQuestionData/${accuracy}/${fromMatch}`, z.object({
            data: z.array(MultiTeamQuestionData)
        })).then(res => {
            if (res) setData(res.data);
        });
    }, [accuracy, fromMatch]);

    const parseQuery = (queryString: string): SearchGroup[] | null => {
        try {
            // Split by OR first (case insensitive)
            const orGroups = queryString.split(/\s+OR\s+/i);

            return orGroups.map(orGroup => {
                // Split by AND within each OR group
                const andConditions = orGroup.split(/\s+AND\s+/i);

                const conditions = andConditions.map(condition => {
                    // Match pattern with APPEARS: namespaceId APPEARS(comparison) value
                    const appearMatch = condition.trim().match(/^(\S+)\s+APPEARS\((>=|<=|!=|>|<|=)(\d+)\)\s+(.+)$/i);

                    if (appearMatch) {
                        return {
                            namespaceId: parseId(appearMatch[1]),
                            operator: 'APPEARS',
                            value: appearMatch[4].trim(),
                            appearComparison: {
                                operator: appearMatch[2],
                                count: parseInt(appearMatch[3])
                            }
                        };
                    }

                    // Match standard pattern: namespaceId operator value
                    // Operators: >=, <=, !=, >, <, =, CONTAINS
                    const match = condition.trim().match(/^(\S+)\s*(>=|<=|!=|>|<|=|CONTAINS)\s+(.+)$/i);

                    if (!match) {
                        throw new Error(`Invalid condition: ${condition}`);
                    }

                    return {
                        namespaceId: parseId(match[1]),
                        operator: match[2].toUpperCase(),
                        value: match[3].trim()
                    };
                });

                return {
                    conditions,
                    logic: 'AND' as const
                };
            });
        } catch (e) {
            return null;
        }
    };

    const evaluateCondition = (condition: SearchCondition, questionData: MultiTeamQuestionData): boolean => {
        const { namespaceId, operator, value, appearComparison } = condition;

        // Find matching question by namespaceId
        if (questionData.metadata.namespaceId !== namespaceId) {
            return false;
        }

        const isQuantitative = questionData.metadata.classification === "quantitative";
        const isStringType = questionData.metadata.type === "string";

        // Handle APPEARS operator for quantitative strings
        if (operator === 'APPEARS') {
            if (!isQuantitative || !isStringType || !appearComparison) {
                return false;
            }

            const searchValue = value.toLowerCase();
            const responses = questionData.teamData[0]?.questionData.responses || [];

            // Count exact matches (case-insensitive)
            const count = responses.filter(r =>
                r.response.toLowerCase() === searchValue
            ).length;

            // Apply comparison
            switch (appearComparison.operator) {
                case '>': return count > appearComparison.count;
                case '<': return count < appearComparison.count;
                case '=': return count === appearComparison.count;
                case '>=': return count >= appearComparison.count;
                case '<=': return count <= appearComparison.count;
                case '!=': return count !== appearComparison.count;
                default: return false;
            }
        }

        if (isQuantitative && !isStringType) {
            // Numeric quantitative - use numeric comparisons
            const teamAverage = questionData.teamData[0]?.questionData.average;
            if (teamAverage === undefined) return false;

            const avgValue = typeof teamAverage === 'string' ? parseFloat(teamAverage) : teamAverage;
            const compareValue = parseFloat(value);

            if (isNaN(avgValue) || isNaN(compareValue)) return false;

            switch (operator) {
                case '>': return avgValue > compareValue;
                case '<': return avgValue < compareValue;
                case '=': return avgValue === compareValue;
                case '>=': return avgValue >= compareValue;
                case '<=': return avgValue <= compareValue;
                case '!=': return avgValue !== compareValue;
                default: return false;
            }
        } else if (isQuantitative && isStringType) {
            // Multiple choice quantitative (stored as strings) - use string matching
            if (operator.toUpperCase() !== 'CONTAINS' && operator !== '=') {
                return false;
            }

            const searchValue = value.toLowerCase();
            const responses = questionData.teamData[0]?.questionData.responses || [];

            if (operator === '=') {
                // Exact match (case-insensitive)
                return responses.some(r =>
                    r.response.toLowerCase() === searchValue
                );
            } else {
                // CONTAINS - substring match
                return responses.some(r =>
                    r.response.toLowerCase().includes(searchValue)
                );
            }
        } else {
            // Qualitative - check all responses for substring match
            if (operator.toUpperCase() !== 'CONTAINS' && operator !== '=') {
                return false;
            }

            const searchValue = value.toLowerCase();
            const responses = questionData.teamData[0]?.questionData.responses || [];

            if (operator === '=') {
                // Exact match (case-insensitive)
                return responses.some(r =>
                    r.response.toLowerCase() === searchValue
                );
            } else {
                // CONTAINS - substring match
                return responses.some(r =>
                    r.response.toLowerCase().includes(searchValue)
                );
            }
        }
    };

    const executeSearch = (input?: string) => {
        if (input != undefined) setQuery(input);
        else input = query;

        input = input.replace(/"/gi, "");

        if (!data || !input.trim()) {
            setResults([]);
            setError(undefined);
            return;
        }

        const searchGroups = parseQuery(input);

        if (!searchGroups) {
            setError("Invalid query syntax. Check the example above.");
            setResults([]);
            return;
        }

        setError(undefined);

        // Build map of team -> question data
        const teamQuestionMap = new Map<number, Map<string, MultiTeamQuestionData>>();

        data.forEach(questionData => {
            questionData.teamData.forEach(teamEntry => {
                if (!teamQuestionMap.has(teamEntry.team)) {
                    teamQuestionMap.set(teamEntry.team, new Map());
                }
                teamQuestionMap.get(teamEntry.team)!.set(
                    questionData.metadata.namespaceId,
                    {
                        ...questionData,
                        teamData: [teamEntry]
                    }
                );
            });
        });

        // Evaluate each team
        const matchingTeams: number[] = [];

        setNumberOfTeams(teamQuestionMap.size);

        teamQuestionMap.forEach((questionMap, teamNumber) => {
            // OR logic between groups
            const matchesAnyGroup = searchGroups.some(group => {
                // AND logic within group
                return group.conditions.every(condition => {
                    const questionData = questionMap.get(condition.namespaceId);
                    if (!questionData) return false;
                    return evaluateCondition(condition, questionData);
                });
            });

            if (matchesAnyGroup) {
                matchingTeams.push(teamNumber);
            }
        });

        setResults(matchingTeams.sort((a, b) => a - b));
    };

    const parseId = (namespaceId: string) => {
        if (namespaceId.includes("#")) {
            const parsedId = data?.[parseInt(namespaceId.split("#")[1]) - 1]?.metadata.namespaceId;
            console.log(parsedId)
            if (parsedId) return parsedId;
        }
        return namespaceId;
    }

    const addToQuery = (toAdd: string) => {
        setQuery(q => q + toAdd);
        searchRef.current?.focus();
    }

    return (
        <Container fluid className="p-4">
            <div className="mb-4">
                <h2 className="mb-3">Boolean Search</h2>
                <p className="text-muted mb-3">
                    Search using: <code>{"{"}question code{"}"} {"{"}operator{"}"} {"{"}value{"}"}</code><br />
                    Operators: <code>&gt;, &lt;, =, &gt;=, &lt;=, !=, CONTAINS, APPEARS(comparison)</code><br />
                    Logic: <code>AND, OR</code><br />
                    Example: <code>#1 &gt; 0 AND #12 = Yes OR #11 APPEARS(&gt;=3) Deep</code><br />
                    This would find teams with a &gt;1 AutoL1 average, who can dealgify most of the time, and have deep climbed &gt;=3 times.<br />
                    <b>Note: Quotes are ignored, parenthesis are not supported.</b>
                </p>

                <div className="d-flex justify-content-center gap-2">
                    <FormControl
                        ref={searchRef}
                        type="text"
                        value={query}
                        onChange={(e) => executeSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                        placeholder="Enter search query..."
                        className="w-md-50"
                    />
                    {/* <Button
                        onClick={executeSearch}
                        variant="primary"
                    >
                        Search
                    </Button> */}
                </div>

                <small className="text-center" style={{ display: "block", fontSize: "12px" }}>
                    {error ? 'Syntax Bad ❌' : 'Syntax Okay ✅'}
                </small>

                {/* {error && (
                    <Alert variant="danger" className="mt-3 mx-auto">
                        {error}
                    </Alert>
                )} */}
            </div>

            <Row>
                <Col lg={7} className="mb-3">
                    <h3 className="mb-3">
                        Results: {results.length} team{results.length !== 1 ? 's' : ''} ({Math.round(results.length / numberOfTeams * 100) || 0}%)
                    </h3>

                    {results.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {results.map(team => (
                                <Button
                                    key={team}
                                    href={`?page=data&viewer=0&team=${team}`}
                                    variant="outline-secondary"
                                    size="sm"
                                >
                                    {team}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted">No results found</p>
                    )}
                </Col>

                <Col lg={5}>
                    <h3 className="mb-3">Question Codes:</h3>
                    <div className="bg-light border rounded p-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {data && data.length > 0 ? (
                            <div>
                                {data.map((questionData, i) => (
                                    <div onClick={() => addToQuery(`#${i + 1} `)} key={questionData.metadata.namespaceId} className="small mb-2">
                                        <span className="text-muted">
                                            #{i + 1} -{" "}
                                        </span>
                                        <code className="text-primary">
                                            {questionData.metadata.namespaceId}
                                        </code>
                                        <span className="text-muted">
                                            {" "}- {questionData.metadata.name}{" "}
                                        </span>
                                        <span className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                            ({questionData.metadata.classification})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted small">Loading questions...</p>
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}