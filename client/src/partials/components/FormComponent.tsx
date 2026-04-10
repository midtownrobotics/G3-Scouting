import formComponents, { FormComponent as FormComponentClass } from "@shared/forms/FormComponents";
import { TEAM_NUMBER_COMPONENT_ID_SEPARATOR } from "@shared/forms/Form";
import Information from "./Information";
import MultipleChoice from "./MultipleChoice";
import Number from "./Number";
import SectionBreak from "./SectionBreak";
import ShortResponse from "./ShortResponse";
import Range from "./Range";
import BooleanInput from "./BooleanInput";
import Timer from "./Timer";
import LongResponse from "./LongResponse";
import { SubmittedResponseType } from "@shared/schemas/data";
import MultiSelect from "./MultiSelect";

function FormComponent({
    component,
    onAnswerChange,
    answer,
    team,
    responseType,
    highlighting,
    hopper
}: {
    component: FormComponentClass,
    onAnswerChange: (id: string, value: string) => void,
    answer: any,
    team?: number,
    teams?: number[],
    responseType: SubmittedResponseType,
    highlighting: boolean,
    hopper?: number | undefined
}) {
    const multiTeamForm = responseType === SubmittedResponseType.MULTI_TEAM_FORMS;

    const _onAnswerChange = (id: string, val: string) => {
        if (!team && multiTeamForm) return;
        if (multiTeamForm) onAnswerChange(team + TEAM_NUMBER_COMPONENT_ID_SEPARATOR + id, val);
        else onAnswerChange(id, val);
    };

    if (component instanceof formComponents.SectionBreak) {
        return <SectionBreak component={component} />;
    }

    if (component instanceof formComponents.Information) {
        return <Information component={component} />;
    }

    if (component instanceof formComponents.MultipleChoice) {
        return <MultipleChoice component={component} onChange={_onAnswerChange} value={answer} highlighting={highlighting} />;
    }

    if (component instanceof formComponents.Number) {
        return <Number hopper={hopper} component={component} onChange={_onAnswerChange} value={answer} highlighting={highlighting} />;
    }

    if (component instanceof formComponents.ShortResponse) {
        return <ShortResponse component={component} onChange={_onAnswerChange} value={answer} highlighting={highlighting} />;
    }

    if (component instanceof formComponents.LongResponse) {
        return <LongResponse component={component} onChange={_onAnswerChange} value={answer} highlighting={highlighting} />;
    }

    if (component instanceof formComponents.Range) {
        return <Range component={component} onChange={_onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.BooleanInput) {
        return <BooleanInput component={component} onChange={_onAnswerChange} value={answer} highlighting={highlighting} />;
    }

    if (component instanceof formComponents.Timer) {
        return <Timer component={component} onChange={_onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.MultiSelect) {
        return <MultiSelect component={component} onChange={_onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.Comparative || component instanceof formComponents.PageBreak) return <></>;

    return <div>Unknown component type</div>;
}

export default FormComponent;
