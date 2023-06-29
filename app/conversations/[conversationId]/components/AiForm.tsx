"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MessageInput from "./MessageInput";
import { HiPaperAirplane, HiEllipsisHorizontal } from "react-icons/hi2";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useOtherUsers from "@/app/hooks/useOtherUsers";
import useConversationAgent from "@/app/hooks/useConversationAgent";
import { Conversation, User } from "@prisma/client";

declare global {
  var shouldDisplay: any | null;
}

interface AiFormProps {
  conversation: Conversation & {
    users: User[];
  };
}

const AiForm: React.FC<AiFormProps> = ({ conversation }) => {
  // const AiForm = () => {
  const { conversationId } = useConversation();

  const router = useRouter();
  const otherUsers = useOtherUsers(conversation);
  // console.log("conversation: ", conversation);
  // console.log("otherUser: ", otherUsers);
  const agent = otherUsers.name;
  // console.log("agent: ", agent);

  const [isLoading, setIsLoading] = useState(!global.shouldDisplay);
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

  // // let agent: string | null = "Agent";
  // const getConversation = axios
  //   .get(`/api/conversations/${conversationId}`)
  //   .then((conversation) => {
  //     agent = useConversationAgent(conversation.data)[0].name;
  //     console.log("agent is: ", agent)
  //   });

  const newPlaceholder = `${agent} is typing...`;
  // console.log("placeholder: ", newPlaceholder);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // global.messageIsBeingGenerated = true;
    // setIsLoading(global.messageIsBeingGenerated);
    // setIsLoading(true);
    global.shouldDisplay = false;
    setIsLoading(global.shouldDisplay);
    setValue("message", "", { shouldValidate: true });
    axios
      .post("/api/messages", {
        ...data,
        conversationId: conversationId,
      })
      .then(() => {
        router.refresh();
      });
  };

  let condition = global.shouldDisplay ? (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 lg:gap-4 w-full"
    >
      <MessageInput
        id="message"
        register={register}
        errors={errors}
        required
        disabled={isLoading}
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
  ) : (
    //<form className="flex items-center gap-2 lg:gap-4 w-full">
    <div className="flex items-center gap-2 lg:gap-4 w-full">
      <MessageInput
        id="message"
        register={register}
        errors={errors}
        required
        disabled={isLoading}
        placeholder={newPlaceholder}
      />

      <HiEllipsisHorizontal
        size={18}
        className="
        text-[#66FCF1]
        "
      />
    </div>
    // </form>
  );

  useEffect(() => {
    console.log("in use effect");
    setIsLoading(!global.shouldDisplay);
    //global.shouldDisplay(global.shouldDisplay);
    condition = global.shouldDisplay ? (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          disabled={isLoading}
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
    ) : (
      <form className="flex items-center gap-2 lg:gap-4 w-full">
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder={newPlaceholder}
          disabled={isLoading}
        />

        <HiEllipsisHorizontal
          size={18}
          className="
          text-[#1F2833]"
        />
      </form>
    );
  }, [isLoading, global.shouldDisplay]);

  //   useEffect(() => {
  //     console.log("triggered undo: ", global.isAi);
  //     // setIsLoading(global.messageIsBeingGenerated);
  //     condition =  ? (
  //       <HiEllipsisHorizontal
  //         size={32}
  //         className="
  //     text-[#66FCF1]
  //     cursor-pointer
  //     hover:text-[#45A29E]
  // transition"
  //       />
  //     ) : (
  //       <button
  //         type="submit"
  //         className="
  //   rounded-full
  //   p-2
  //   bg-[#66FCF1]
  //   transition"
  //       >
  //         <HiPaperAirplane size={18} className="text-[#1F2833]" />
  //       </button>
  //     );
  //   }, [global.messageIsBeingGenerated]);

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
        {condition}
      </div>
    </>
  );
};

export default AiForm;
