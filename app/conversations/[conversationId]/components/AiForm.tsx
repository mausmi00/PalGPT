"use client";

import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MessageInput from "./MessageInput";
import { HiPaperAirplane, HiEllipsisHorizontal } from "react-icons/hi2";
import { useEffect } from "react";
import { useRouter } from "next/router";

declare global {
  var shouldDisplay: any | null;
}
// interface AiFormProps {
//   show?: boolean;
// }

// const AiForm: React.FC<AiFormProps> = ({ show }) => {
const AiForm = () => {
  const { conversationId } = useConversation();

  const router = useRouter();
  
  // const [isLoading, setIsLoading] = useState(show);
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
    // global.messageIsBeingGenerated = true;
    // setIsLoading(global.messageIsBeingGenerated);
    // setIsLoading(true);
    global.shouldDisplay = false;
    setValue("message", "", { shouldValidate: true });
    axios.post("/api/messages", {
      ...data,
      conversationId: conversationId,
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
        placeholder="Loading..."
      />

      <HiEllipsisHorizontal
        size={18}
        className="
        text-[#66FCF1]
        "
      />
    </form>
  );

  useEffect(() => {
    console.log("in use effect");
    router.refresh();
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
          placeholder="Loading..."
        />

        <HiEllipsisHorizontal
          size={18}
          className="
          text-[#1F2833]"
        />
      </form>
    );
  }, [global.shouldDisplay]);

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
