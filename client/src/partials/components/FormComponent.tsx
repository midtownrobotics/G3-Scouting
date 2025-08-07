import formComponents, { FormComponent as FormComponentClass } from "@shared/forms/FormComponents";
import Information from "./Information";
import MultipleChoice from "./MultipleChoice";
import Number from "./Number";
import SectionBreak from "./SectionBreak";
import ShortResponse from "./ShortResponse";

function FormComponent({
    component,
    onAnswerChange,
    answer,
    team
}: {
    component: FormComponentClass,
    onAnswerChange: (id: string, value: string) => void,
    answer: any,
    team?: number,
}) {
    const _onAnswerChange = (id: string, val: string) => {
        onAnswerChange(team ? team + "##" + id : id, val);
    };

    if (component instanceof formComponents.SectionBreak) {
        return <SectionBreak component={component} />;
    }

    if (component instanceof formComponents.Information) {
        return <Information component={component} />;
    }

    if (component instanceof formComponents.MultipleChoice) {
        return <MultipleChoice component={component} onChange={_onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.Number) {
        return <Number component={component} onChange={_onAnswerChange} value={answer} />;
    }

    if (component instanceof formComponents.ShortResponse) {
        return <ShortResponse component={component} onChange={_onAnswerChange} value={answer} />;
    }

    return <div>Unknown component type</div>;
}

export default FormComponent;
