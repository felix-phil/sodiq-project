import React from "react";
import { Input } from "@headlessui/react"; // adjust import path if needed

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement>  {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  touched,
}) => {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-[#61698D] mb-1">
        {label}
      </label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="outline-none h-[45px] px-5 bg-[#F6F8FA] rounded-sm border border-[#E2E4E9] w-full text-[#61698D]"
      />
      {touched && error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormInput;