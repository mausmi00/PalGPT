"use client";

import { Message } from "postcss";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface MessageInputProps {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean
}
const MessageInput: React.FC<MessageInputProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors,
  disabled
}) => {
  return (
    <div
      className="
  relative w-full"
    >
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        disabled={disabled}
        className="
        text-[#1F2833]
        font-light
        py-2
        px-4
        bg-gradient-to-r from-[#66FCF1] to-white
        opacity-100
        w-full
        rounded-full
        focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
