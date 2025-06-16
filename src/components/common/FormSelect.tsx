import { Listbox } from "@headlessui/react";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import React from "react";

type Option = {
  label: string;
  value: string | number;
};

type FormSelectProps = {
  label: string;
  name: string;
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
};

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  touched,
}) => {
  const selected = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-[#61698D] mb-1">
        {label}
      </label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button
            className="outline-none h-[45px] px-5 bg-[#F6F8FA] rounded-sm border border-[#E2E4E9] w-full text-[#61698D] text-left flex items-center justify-between"
            name={name}
          >
            <span>{selected?.label || "Select..."}</span>
            <FiChevronDown className="w-4 h-4 text-[#61698D]" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-sm bg-white py-1 text-sm shadow-lg border border-[#E2E4E9]">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? "bg-[#F6F8FA]" : ""
                  }`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <span className="text-[#61698D]">{option.label}</span>
                    {selected && <FiCheck className="w-4 h-4 text-primary" />}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
      {touched && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormSelect;