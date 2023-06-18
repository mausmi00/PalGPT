"use client";

import clsx from "clsx";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
  placeholder?: string
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
  placeholder
}) => {
  return (
    <div>
      <label
        className="
        block
        text-sm
        font-medium
        leading-6
        "
        htmlFor={id}
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          placeholder={placeholder}
          {...register(id, {
            required,
          })} /*register handles actions like onChange, onFocus and a bunch of other functions */
          /* clsx: allows us to dynamically use classes */
          className={clsx(
            `
        form-input
        block
        w-full
        rounded-md
        border-0
        py-1.5
        text-[#1F2833]
        shadow-sm
        ring-1
        ring-inset
        placeholder:text-[#1F2833]
        focus:ring-2
        focus:ring-inset
        focus:ring-[#66FCF1]
        sm:text-sm
        sm:leading-6`,
            errors[id] &&
              "focus:ring-rose-500" /* if errors has an id then it will be displayed in red */,
            disabled && "opactity-50 cursor-default"
          )}
        />
      </div>
    </div>
  );
};

export default Input;
