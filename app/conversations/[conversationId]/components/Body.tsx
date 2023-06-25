"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find } from "lodash";
import { useRouter } from "next/navigation";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const router = useRouter();

  const { conversationId } = useConversation();

  useEffect(() => {
    router.refresh();
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      setTimeout(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);

        setMessages((current) => {
          if (find(current, { id: message.id })) {
            return current;
          }

          return [...current, message];
        });

        bottomRef?.current?.scrollIntoView();
      }, 2000);
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <>
          {message != null ? (
            <div>
              <MessageBox
                isLast={i === messages.length - 1}
                key={message.id}
                data={message}
              />
              {message.lastMessageOfTheContext == true ? (
                <fieldset className="border-t border-slate-300">
                  <legend className="mx-auto px-4 text-white text-sm italic">
                    context cleared
                  </legend>
                </fieldset>
              ) : null}
            </div>
          ) : null}
        </>
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
