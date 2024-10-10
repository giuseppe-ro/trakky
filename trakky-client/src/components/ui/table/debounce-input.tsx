import React, { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface SelectOption {
  key: string;
  value: string;
  text?: string;
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce, value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

DebouncedInput.defaultProps = {
  debounce: null,
};

export function DebouncedSelect({
  value: initialValue,
  options,
  onChange,
  debounce = 500,
}: {
  value: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  debounce?: number | undefined;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce, value]);

  return (
    <Select defaultValue="All" onValueChange={(e) => setValue(e)}>
      <SelectTrigger className="w-full justify-between h-6 border-none outline-none focus:bg-secondary bg-primary-foreground text-xs p-0 pl-2 md:pr-1 md:py-1 rounded-none overflow-hidden">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        <SelectGroup>
          <SelectItem key="All" value="All" className="text-xs">
            All
          </SelectItem>
          {options.map((option: SelectOption) => (
            <SelectItem
              key={option.key}
              value={option.value}
              className="text-xs"
            >
              {option.key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

DebouncedSelect.defaultProps = {
  debounce: null,
};
