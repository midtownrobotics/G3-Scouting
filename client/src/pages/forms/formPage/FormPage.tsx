import Form, { FormType } from "@shared/forms/Form";
import { MatchData, QuestionResponse, SubmittedResponse, SubmittedResponseType } from "@shared/schemas/data";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { fetchAPIJSON, postAPI } from "../../../API";
import FormComp from "../../../partials/FormComp";
import { useUserData } from "../../../userData";
import './FormPage.css';
import { Alliance } from "@shared/utils";
import { AssignmentType } from "@shared/schemas/schedule";

function FormPage({ form }: { form: React.RefObject<Form | null>; }) {
    const [answers, setAnswers] = useState(new Map<string, string>());
    const [submitting, setSubmitting] = useState(false);
    const [matchData, setMatchData] = useState<MatchData>()

    const userDataProvider = useUserData();
    const userData = userDataProvider.userData;
    const nextMatch = userData?.user.nextMatch;

    const [knownMatch, setKnownMatch] = useState<number>();

    const [inProgress, setInProgress] = useState(false);

    const [highlighting, setHighlighting] = useState<number>();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setHighlighting(undefined);
                return;
            }

            const max = (form.current?.getComponents().length ?? 0) - 1;

            if (e.key === 'ArrowDown') {
                setHighlighting(prev => {
                    const next = (prev ?? 0) + 1;
                    return next > max ? max : next;
                });
            }
            if (e.key === 'ArrowUp') {
                setHighlighting(prev => {
                    const next = (prev ?? 0) - 1;
                    return next < 0 ? 0 : next;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    
    useEffect(() => {
        if (inProgress) return;
        if (nextMatch?.number === knownMatch && knownMatch !== undefined) return;
        if (nextMatch?.number) setKnownMatch(nextMatch?.number);

        fetchAPIJSON("/getCurrentMatch", MatchData).then(res => {
            if (!res) return;
            setMatchData(res);

            if (
                (
                    form.current?.type === FormType.WHOLE_MATCH ||
                    form.current?.type === FormType.COMPARATIVE
                ) &&
                teams !== res.teams
            ) setTeams(res.teams);

            if (
                form.current?.openSubmission &&
                form.current?.type === FormType.ALLIANCE &&
                teams !== res.blue &&
                teams !== res.red
            ) setTeams(res.blue);

            if (nextMatch?.team !== undefined && nextMatch.number === matchData?.number) {
                setTeam(nextMatch.team);
            } else {
                setTeam(res.teams[0])
            }

            setInProgress(true);
        })
    }, [nextMatch, knownMatch, inProgress])

    const [team, setTeam] = useState<number>();
    const [teams, setTeams] = useState<number[]>();
    const [alliance, _setAlliance] = useState<Alliance>();
    const setAlliance = (a: Alliance) => {
        if (form.current?.type !== FormType.ALLIANCE) return;
        _setAlliance(a)
        setTeams(a === Alliance.RED ? matchData?.red : matchData?.blue)
    }

    const handleAnswerChange = (componentId: string, value: string) => {
        setAnswers(prev => {
            const newAnswers = new Map(prev);
            newAnswers.set(componentId, value);
            return newAnswers;
        });
    };

    const submitForm = async () => {
        setSubmitting(true);

        if (!form.current) return submittingFail();

        let res: Response | null;

        if (
            form.current.type === FormType.ALLIANCE ||
            form.current.type === FormType.WHOLE_MATCH ||
            form.current.type === FormType.COMPARATIVE
        ) {
            const teamsMap = new Map<string, QuestionResponse[]>();
            for (const a of answers) {
                const [team, id] = a[0].split("##");
                if (!teamsMap.has(team)) {
                    teamsMap.set(team, []);
                }
                teamsMap.get(team)?.push({ question: id, response: a[1] });
            }

            res = await postAPI("/forms/submitForm", {
                type: SubmittedResponseType.MULTI_TEAM_FORMS,
                formId: form.current.id,
                teams: Array.from(teamsMap).map(t => parseInt(t[0])),
                responses: Array.from(teamsMap).map(r => ({
                    responses: r[1],
                    team: parseInt(r[0]),
                    formId: form.current?.id,
                    match: nextMatch?.number ?? matchData?.number
                })),
            } as SubmittedResponse);
        } else {
            res = await postAPI("/forms/submitForm", {
                type: SubmittedResponseType.SINGLE_TEAM_FORMS,
                formId: form.current.id,
                response: {
                    responses: Array.from(answers).map(([question, response]) => ({ question, response })),
                    formId: form.current.id,
                    match: nextMatch?.number ?? matchData?.number,
                    team
                }
            } as SubmittedResponse);
        }

        setTimeout(() => setSubmitting(false), 1000)

        if (res?.status !== 200) return submittingFail();
        resetWindow();
    };

    const resetWindow = () => {
        setInProgress(false);
        userDataProvider.apiStatusRefresh();
        setAnswers(new Map());
        window.scrollTo(0, 0);
    }

    const submittingFail = () => {
        setSubmitting(false);
        alert("Submit FAILED. Check internet and try again.");
    };

    if (!form.current) return (<h1>You can't be here.</h1>);

    if (!form.current.openSubmission && (nextMatch == null || nextMatch.number !== matchData?.number || nextMatch.finished)) return (
        <div id="form-page">
            {userData?.currentAssignment?.type === AssignmentType.ASSIGNED ?
                <h1>Waiting for next assignment...</h1> : (
                    <>
                        <h1>You aren't currently assigned to scout.</h1>
                        <h3>This form is locked, so you must be assigned to access it.</h3>
                    </>
                )
            }
        </div>
    )

    return (
        <div id="form-page">
            {/* <h1>{inProgress ? "in progress" : "not in progress"}</h1>
            <h1>{userData?.user.nextMatch?.finished ? "submitted" : "not submitted"}</h1> */}
            <h1>{form.current.name}</h1>

            <FormComp
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                form={form.current}
                match={matchData?.number}
                team={team}
                teams={teams}
                alliance={alliance}
                highlighting={(highlighting !== undefined && form.current.type === FormType.TEAM) ? form.current.getComponents()[highlighting]?.getId() : undefined}
                setTeam={form.current.openSubmission ? setTeam : undefined}
                setAlliance={form.current.openSubmission ? setAlliance : undefined}
            />

            <br />

            <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>
            <br />
            <br />
            <Button id="advance" variant="warning" disabled={submitting} onClick={() => confirm("You are about to reset all your data for this match.") ? resetWindow() : undefined}>Advance match without submitting</Button>
        </div>
    );
}

export default FormPage;