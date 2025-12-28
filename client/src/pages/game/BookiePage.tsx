import { GamblingQuestion } from "@shared/schemas/game";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { fetchAPIJSON, postAPI } from "../../API";
import { z } from "zod";
import { Check2Circle, Circle, Floppy, Lock, Plus, Trash, Unlock } from "react-bootstrap-icons";
import { MatchData } from "@shared/schemas/data";

export function BookiePage() {
    const [questions, setQuestions] = useState<GamblingQuestion[]>([]);
    const [question, setQuestion] = useState<GamblingQuestion>();
    const [match, setMatch] = useState(1);
    const [newResponse, setNewResponse] = useState("");
    const [saving, setSaving] = useState(false);
    const [currentMatch, setCurrentMatch] = useState<number>();

    useEffect(() => {
        fetchAPIJSON("/game/bookie/getQuestions", z.array(GamblingQuestion)).then(q => q && setQuestions(q));
        fetchAPIJSON("/getCurrentMatch", MatchData).then(m => {
            m && setMatch(m?.number);
            setCurrentMatch(m?.number);
        });
    }, []);

    useEffect(() => {
        const found = questions.find(q => q.match === match);
        if (found) {
            setQuestion(found);
        } else {
            setQuestion({
                match,
                question: "",
                responses: [],
                locked: false,
                correctResponse: undefined
            });
        }
    }, [match, questions]);

    const saveNewResponse = () => {
        console.log(!question || !(newResponse.trim()))
        if (!question || !(newResponse.trim())) return;
        setQuestion({
            ...question,
            responses: [...(question.responses || []), newResponse.trim()],
        });
        setNewResponse("");
    };

    const updateQuestionText = (text: string) => {
        if (!question) return;
        setQuestion({ ...question, question: text });
    };

    const deleteResponse = (index: number) => {
        if (!question) return;
        setQuestion({
            ...question,
            responses: question.responses.filter((_, i) => i !== index),
        });
    };

    const setCorrectResponse = (index: number) => {
        if (!question) return;
        if (!question.locked) return alert("Question needs to be locked before an answer can be set."); 
        if (!confirm("Once a correct answer is saved, it cannot be changed.")) return;
        setQuestion({
            ...question,
            correctResponse: index,
        });
    };

    const saveQuestion = () => {
        setSaving(true);
        postAPI("/game/bookie/setQuestion", question).then(() => {
            setTimeout(() => setSaving(false), 2000);
        });
    }

    const toggleLock = () => {
        if (!question) return;
        setQuestion({ ...question, locked: !question.locked });
    }

    return (
        <div className="d-flex justify-content-center w-100">
            <div className="d-flex flex-column align-items-center w-md-50">
                <h1>Bookie Page</h1>
                <br />

                <div className="mb-4 text-center">
                    <h3>Questions Needing Correct Answers</h3>
                    <div className="text-center">
                        {questions.filter(q => q.correctResponse === undefined && q.match <= (currentMatch ?? 0)).map(q =>
                            <Button variant="link" className="m-1 p-0" onClick={() => setMatch(q.match)}>Match {q.match}</Button>
                        )}
                    </div>
                </div>

                <div className="d-flex gap-1 w-50">
                    <Button variant="dark" onClick={() => setMatch(match - 1)}>-</Button>
                    <Form.Control
                        className="text-center"
                        type="text"
                        value={match}
                        onChange={(e) => setMatch(parseInt(e.target.value) || 0)}
                    />
                    <Button variant="dark" onClick={() => setMatch(match + 1)}>+</Button>
                </div>

                <br />

                <div className="w-100">
                    <h6>Question</h6>
                    <div className="mb-3">
                        <Form.Control
                            type="text"
                            value={question?.question}
                            onChange={(e) => updateQuestionText(e.target.value)}
                            placeholder="Question"
                            className="mb-1"
                        />
                        <Button
                            disabled={saving}
                            onClick={toggleLock}
                            variant="light"
                            className="w-100"
                        >
                            {question?.locked
                                ? <>Unlock <Unlock /></>
                                : <>Lock <Lock /></>
                            }
                        </Button>
                    </div>

                    <h6>Responses</h6>
                    {question?.responses.map((r, i) => (
                        <div key={i} className="d-flex gap-1 mb-1">
                            <Form.Control
                                type="text"
                                value={r}
                                disabled
                            />
                            <Button variant="secondary" onClick={() => setCorrectResponse(i)} className="d-flex align-items-center">
                                {question.correctResponse == i ? <Check2Circle /> : <Circle />}
                            </Button>
                            <Button variant="danger" onClick={() => deleteResponse(i)} className="d-flex align-items-center">
                                <Trash />
                            </Button>
                        </div>
                    ))}

                    <div className="d-flex gap-1 mb-4">
                        <Form.Control
                            type="text"
                            value={newResponse}
                            onChange={(e) => setNewResponse(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveNewResponse(); }}
                            placeholder="New Response"
                        />
                        <Button variant="success" onClick={saveNewResponse} className="d-flex align-items-center">
                            <Plus />
                        </Button>
                    </div>

                    <br />

                    <Button
                        disabled={saving}
                        variant="success"
                        onClick={saveQuestion}
                        className="w-100"
                    >
                        Save <Floppy />
                    </Button>
                </div>
            </div>
        </div>
    );
}
