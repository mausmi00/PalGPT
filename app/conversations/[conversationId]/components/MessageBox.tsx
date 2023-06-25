import { FullMessageType } from "@/app/types";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Avatar from "@/app/components/Avatar";
import { format } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast: boolean;
} 

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data?.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(",");

  const container = clsx("flex gap-5 p-4", isOwn && "justify-end");

  const avatar = clsx(isOwn && "order-2");

  const body =clsx("flex flex-col gap-4", isOwn && "items-end");

  const messages = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-[#66FCF1] text-[#1F2833]" : "bg-white text-[#1F2833]",
    data.image ? "rounded-md p-0" : "rounded-xl py-2 px-2"
  );

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={data.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-white">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={messages}>
          <ImageModal
            src={data.image}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
          {data.image ? (
            <Image
              onClick={() => setIsImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="
                object-cover
                cursor-pointer
                hover:scale-10
                transition
                translate"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div
            className="
        text-xs
        font-light
        text-gray-500"
          >
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
