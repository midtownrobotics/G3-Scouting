import Form, { FormType } from "@shared/forms/Form";
import { MatchData, QuestionResponse, SubmittedResponse } from "@shared/schemas/data";
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

    useEffect(() => {
        if (nextMatch?.number === knownMatch) return;
        setKnownMatch(nextMatch?.number);

        fetchAPIJSON("/getCurrentMatch", MatchData).then(res => {
            if (res) setMatchData(res);
        })
        if (nextMatch?.team !== undefined) {
            setTeam(nextMatch.team);
        }
    }, [nextMatch, knownMatch])

    const [team, setTeam] = useState(nextMatch?.team);
    const [teams, setTeams] = useState(nextMatch?.teams);
    const [alliance, _setAlliance] = useState(userData?.user.redAlliance ? Alliance.RED : Alliance.BLUE);
    const setAlliance = (a: Alliance) => {
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

        if (form.current.type === FormType.ALLIANCE) {
            const teamsMap = new Map<string, QuestionResponse[]>();
            for (const a of answers) {
                const [team, id] = a[0].split("##");
                if (!teamsMap.has(team)) {
                    teamsMap.set(team, []);
                }
                teamsMap.get(team)?.push({ question: id, response: a[1] });
            }

            res = await postAPI("/forms/submitForm", {
                type: FormType.ALLIANCE,
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
                type: FormType.TEAM,
                formId: form.current.id,
                response: {
                    responses: Array.from(answers).map(([question, response]) => ({ question, response })),
                    formId: form.current.id,
                    match: nextMatch?.number ?? matchData?.number,
                    team
                }
            } as SubmittedResponse);
        }

        userDataProvider.apiStatusRefresh();

        setTimeout(() => setSubmitting(false), 1000)

        if (res?.status !== 200) return submittingFail();

        setAnswers(new Map());
        window.scrollTo(0, 0);
    };

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
            <h1>{form.current.name}</h1>

            <FormComp
                answers={answers}
                handleAnswerChange={handleAnswerChange}
                form={form.current}
                match={nextMatch?.number ?? matchData?.number}
                team={team}
                teams={teams}
                alliance={alliance}
                setTeam={setTeam}//{form.current.openSubmission ? setTeam : undefined}
                setAlliance={form.current.openSubmission ? setAlliance : undefined}
            />

            <br />

            <Button id="submit" variant="success" disabled={submitting} onClick={submitForm}>{submitting ? <Spinner role="status" /> : "Submit"}</Button>
        </div>
    );
}

export default FormPage;