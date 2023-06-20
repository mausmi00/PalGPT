"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";

const AiForm = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
    });
  };

  return (
    <>
      <div
        className="
  py-4
  px-4
  bg-[#1F2833]
  border-t
  flex
  items-center
  gap-2
  lg:gap-4
  w-full
  "
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-center gap-2 lg:gap-4 w-full"
        >
          <MessageInput
            id="message"
            register={register}
            errors={errors}
            required
            placeholder="Write a message"
          />
          <button
            type="submit"
            className="
        rounded-full
        p-2
        bg-[#66FCF1]
        cursor-pointer
        hover:bg-[#45A29E]
        transition"
          >
            <HiPaperAirplane size={18} className="text-[#1F2833]" />
          </button>
        </form>
      </div>
    </>
  );
};

export default AiForm;
