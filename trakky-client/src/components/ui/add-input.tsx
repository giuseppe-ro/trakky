import { Button } from '@/components/ui/button';
import { SubmittableInput } from './input';

interface AddComponentProps {
  onAdd: () => void;
  setNew: (value: string) => void;
  childrenSelection?: JSX.Element;
}

export default function AddComponent({
  onAdd,
  setNew,
  childrenSelection,
}: AddComponentProps) {
  return (
    <div className="flex my-2 flex-row lg:flex-row justify-around">
      <Button
        onClick={onAdd}
        type="submit"
        variant="outline"
        className="rounded-r-none border-green-500/50 hover:bg-green-500/50"
      >
        Add
      </Button>
      {childrenSelection}
      <SubmittableInput
        onSubmit={onAdd}
        onChange={(e) => setNew(e.target.value)}
        className="rounded-l-none focus-visible:ring-0 focus-visible:outline-none h-8 outline-none"
      />
    </div>
  );
}

AddComponent.defaultProps = {
  childrenSelection: null,
};
