import { Button } from '@/components/ui/button';
import { Dictionary } from '@/components/ui/table/icons';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SharedExpensesFiltersProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  entries: string[];
  checkBoxStates: Dictionary<boolean>;
  setCheckboxStates: (states: Dictionary<boolean>) => void;
}

const checkboxStyle = (isChecked: boolean) =>
  twMerge(
    'text-base font-normal h-9 transition-colors duration-300',
    isChecked
      ? 'bg-button-checkbox hover:bg-button-checkbox text-primary hover:text-primary hover:font-bold'
      : 'bg-background hover:bg-background text-muted-foreground/50 hover:text-muted-foreground'
  );

interface CheckBoxButtonProps {
  name: string;
  checkBoxStates: Dictionary<boolean>;
  setCheckBox: (key: string) => void;
}

function CheckBoxButton({
  name,
  checkBoxStates,
  setCheckBox,
}: CheckBoxButtonProps) {
  return (
    <Button
      variant="outline"
      className={checkboxStyle(checkBoxStates[name])}
      onClick={() => setCheckBox(name)}
    >
      {name}
    </Button>
  );
}

interface FilterContainerProps {
  title: string;
  children: JSX.Element;
}

function FilterContainer({ title, children }: FilterContainerProps) {
  return (
    <div className="flex flex-row gap-2 justify-start mx-1 my-4 align-middle">
      <span className="self-center min-w-[20%] max-w-[25%] text-nowrap no-scrollbar text-base text-muted-foreground align-middle text-left h-full overflow-x-scroll">
        {title}
      </span>
      <div className="flex flex-row flex-wrap align-middle gap-2">
        {children}
      </div>
    </div>
  );
}

export function SingleButtonFilter({
  title,
  entries,
  checkBoxStates,
  setCheckboxStates,
}: SharedExpensesFiltersProps) {
  async function setOnlyOneCheckBox(key: string) {
    const states: Dictionary<boolean> = {};

    const currentState = checkBoxStates[key];

    Object.keys(checkBoxStates).forEach((state) => {
      states[state] = false;
    });

    states[key] = !currentState;

    setCheckboxStates(states);
  }

  return (
    <FilterContainer title={title}>
      <>
        {entries.sort().map((name) => {
          return (
            <CheckBoxButton
              key={name}
              name={name}
              checkBoxStates={checkBoxStates}
              setCheckBox={() => setOnlyOneCheckBox(name)}
            />
          );
        })}
      </>
    </FilterContainer>
  );
}

export function MultyButtonFilters({
  title,
  entries,
  checkBoxStates,
  setCheckboxStates,
}: SharedExpensesFiltersProps) {
  async function setAllCheckBoxes() {
    const states: Dictionary<boolean> = {};

    const newState = !checkBoxStates.All;

    Object.keys(checkBoxStates).forEach((state) => {
      states[state] = newState;
    });

    setCheckboxStates(states);
  }

  function allCheckboxesOn(dictionary: Dictionary<boolean>, newState: boolean) {
    return (
      newState === true && Object.values(dictionary).every((e) => e === true)
    );
  }

  function setCheckBox(key: string) {
    const states: Dictionary<boolean> = {};

    Object.keys(checkBoxStates).forEach((state) => {
      states[state] = checkBoxStates[state];
    });

    const newState = !states[key];

    states[key] = newState;

    const usersState: Dictionary<boolean> = {};

    Object.keys(states).forEach((user) => {
      if (user !== 'All') {
        usersState[user] = states[user];
      }
    });

    if (allCheckboxesOn(usersState, newState)) {
      states.All = true;
    } else {
      states.All = false;
    }

    setCheckboxStates(states);
  }

  return (
    <FilterContainer title={title}>
      <>
        <CheckBoxButton
          key="All"
          name="All"
          checkBoxStates={checkBoxStates}
          setCheckBox={() => setAllCheckBoxes()}
        />
        {entries.map((name) => {
          return (
            <CheckBoxButton
              key={name}
              name={name}
              checkBoxStates={checkBoxStates}
              setCheckBox={() => setCheckBox(name)}
            />
          );
        })}
      </>
    </FilterContainer>
  );
}
