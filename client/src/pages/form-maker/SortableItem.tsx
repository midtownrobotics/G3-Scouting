import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormComponent } from '@shared/forms/FormComponents';
import FormComponentCard from './components/FormComponentCard';

export default function SortableItem({ id, deleteFn, component }: { id: string, deleteFn: () => void, component?: FormComponent; }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (component === undefined) {
        return <div></div>;
    }

    return (
        <div className="mx-3 my-2 w-60" ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <FormComponentCard component={component} deleteFn={deleteFn} />
        </div>
    );
}