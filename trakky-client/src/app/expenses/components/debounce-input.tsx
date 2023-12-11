import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useEffect, useState } from "react";

export interface SelectOption {
  key: string,
  value: string,
  text?: string
}

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function DebouncedSelect({
  value: initialValue,
  options,
  onChange,
  debounce = 500,
}: {
  value: string | number;
  options: SelectOption[];
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Select
      defaultValue={"All"}
      onValueChange={(e) => setValue(e)}
    >
      <SelectTrigger className="w-full justify-between h-[18px] md:h-[19.4px] border-none outline-none bg-slate-800 text-xxs md:text-xs p-0 pl-0.5 md:p-1 rounded-none overflow-hidden">
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        <SelectGroup>
          <SelectItem key={"All"} value={"All"} className="text-xs">
            {"All"}
          </SelectItem>
          {options.map((option: SelectOption, index: number) => (
            <SelectItem key={index} value={option.value} className="text-xs">
              {option.key}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
