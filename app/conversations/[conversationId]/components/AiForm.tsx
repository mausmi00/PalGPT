"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";
import { HiPaperAirplane } from "react-icons/hi2";
import { CldUploadButton } from "next-cloudinary";
import getAiResponse from "@/app/actions/getAiResponse";
import getIsAiConversation from "@/app/actions/getIsAiConversation";
import { useState } from "react";

const AiForm = async () => {
  const { conversationId } = useConversation();
  const [input, setInput] = useState("");
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
    // setInput(data.message);
    // //console.log("data message is: ", data.message);
    // const isAiConvo = await getIsAiConversation(conversationId);
    // if (isAiConvo) {
    //   const response = await getAiResponse(data.message);
    //   setValue("message", "", { shouldValidate: true });
    //   axios.post("/api/messages", {
    //     response,
    //     conversationId: conversationId,
    //   });
    // }
  };

  // const isAiConvo = await getIsAiConversation(conversationId);
  // const onAiSubmit = () => {
  //   setValue("message", "", { shouldValidate: true });
  //   axios.post("/api/messages", {
  //     input,
  //     conversationId: conversationId,
  //   });
  // };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      image: result?.info?.secure_url,
      conversationId,
    });
  };

  return (
    <>
      <div
        className="
  py-4
  px-4
  bg-white
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
        bg-sky-500
        cursor-pointer
        hover:bg-sky-600
        transition"
          >
            <HiPaperAirplane size={18} className="text-white" />
          </button>
        </form>
      </div>
    </>
  );
};

export default AiForm;
