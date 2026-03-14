import Form, { FormType, TEAM_NUMBER_COMPONENT_ID_SEPARATOR } from "@shared/forms/Form";
import { MatchData, QuestionResponse, SubmittedResponse, SubmittedResponseType } from "@shared/schemas/data";
import React, { useEffect, useState } from "react";
import { Button, OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import { fetchAPIJSON, postAPI } from "../../../API";
import FormComp from "../../../partials/FormComp";
import { useUserData } from "../../../userData";
import './FormPage.css';
import { Alliance } from "@shared/utils";
import { AssignmentType } from "@shared/schemas/schedule";
import formComponents from "@shared/forms/FormComponents";

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

    const [pageNum, setPageNum] = useState(0);

    const pageBreaks = form.current?.getComponents().filter(c => c instanceof formComponents.PageBreak) ?? [];
    const maxPageNum = pageBreaks.length;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setHighlighting(undefined);
                return;
            }

            const max = (form.current?.getComponents().length ?? 0) - 1;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlighting(prev => {
                    const next = prev === undefined ? 0 : Math.min(prev + 1, max);
                    // document.querySelectorAll('.form-component')[next]
                    //     ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.scrollBy({ top: 75 })
                    return next;
                });
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlighting(prev => {
                    const next = prev === undefined ? 0 : Math.max(prev - 1, 0);
                    // document.querySelectorAll('.form-component')[next]
                    //     ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.scrollBy({ top: -75 })
                    return next;
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
            ) {
                setTeams(res.teams);
                setInProgress(true);
            }

            if (
                form.current?.openSubmission &&
                form.current?.type === FormType.ALLIANCE &&
                teams !== res.blue &&
                teams !== res.red
            ) {
                setTeams(res.blue);
                setInProgress(true);
            }

            if (nextMatch?.team !== undefined && nextMatch.number === matchData?.number) {
                setTeam(nextMatch.team);
                setInProgress(true);
            } else {
                setTeam(res.teams[0])
            }
        })
    }, [nextMatch, knownMatch, inProgress]);

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
                const [team, id] = a[0].split(TEAM_NUMBER_COMPONENT_ID_SEPARATOR);
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
        setPageNum(0);
    }

    const submittingFail = () => {
        setSubmitting(false);
        alert("Submit FAILED. Check internet and try again.");
    };

    const [checkingIn, setCheckingIn] = useState(false)
    const [checkingOut, setCheckingOut] = useState(false)

    useEffect(() => {
        if (userData?.checkedIn) setCheckingIn(false);
        if (userData?.checkedIn === false) setCheckingOut(false);
    }, [userData?.checkedIn]);

    const checkIn = () => {
        setCheckingIn(true);
        postAPI("/checkIn", {});
    }

    const checkOut = () => {
        setCheckingOut(true);
        postAPI("/checkOut", {});
    }

    if (!form.current) return;

    if (
        !form.current.openSubmission &&
        (
            nextMatch == null ||
            nextMatch.number !== matchData?.number ||
            nextMatch.finished ||
            (
                !nextMatch.alliance &&
                !nextMatch.team &&
                !nextMatch.teams
            )
        )
    ) return (
        <div id="form-page">
            {userData?.currentAssignment?.type === AssignmentType.ASSIGNED ?
                <h1>Waiting for next assignment...</h1> : (
                    <>
                        <h1>You aren't currently assigned to scout.</h1>
                        <h3>This form is locked, so you must be assigned to access it.</h3>
                        <br />
                        <br />
                        {userData?.checkedIn
                            ? <h3>You are checked in. You will be assigned a team for the next match.</h3>
                            : <h3>You can also <a href="#" onClick={e => { e.preventDefault(); !checkingIn && checkIn(); }}>check in</a> to be able to scout on your breaks.</h3>
                        }
                    </>
                )
            }
        </div>
    )

    return (
        <div id="form-page">
            {userData?.checkedIn && <h3>You are checked in. Click here to <a href="#" onClick={e => { e.preventDefault(); !checkingOut && checkOut(); }}>check out</a>.</h3>}

            <h1>{form.current.name}</h1>
            <OverlayTrigger
                placement="bottom"
                overlay={
                    <Tooltip id="tooltip-bottom" style={{ "--bs-tooltip-max-width": "400px" } as React.CSSProperties}>
                        '↑ / ↓' - Start hotkey mode and cycle questions <br />
                        '←/→' - Increment or decrement by 1 or cycle responses<br />
                        'Shift' - Increment by 5 <br />
                        '/' - Increment by 10 <br />
                        '0' - Reset counter to 0 <br />
                        'Esc' - Stop hotkey mode
                    </Tooltip>
                }
            >
                <small
                    hidden={form.current.type !== FormType.TEAM}
                    className="text-decoration-underline text-primary"
                >Hotkey Info</small>
            </OverlayTrigger>

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
                pageNum={pageNum}
            />

            <br />

            {pageNum === maxPageNum && <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>}
            {pageNum !== maxPageNum && <Button id="submit" variant="success" disabled={submitting} onClick={() => { setPageNum(p => p + 1); window.scrollTo(0, 0); }}>Advance to {pageBreaks[pageNum].title}</Button>}
            <br />
            <br />
            <Button id="advance" variant="warning" disabled={submitting} onClick={() => confirm("You are about to reset all your data for this match.") ? resetWindow() : undefined}>Advance match without submitting</Button>
        </div>
    );
}

export default FormPage;