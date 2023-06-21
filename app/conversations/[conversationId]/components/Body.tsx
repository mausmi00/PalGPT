"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

export default async function Body({
  initialMessages,
}: {
  initialMessages: FullMessageType[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (newMessage: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      // if the current messages already has the new message (the id is the same) then we don't add it to the
      //collection of messages
      setMessages((currentMessage) => {
        if (find(currentMessage, { id: newMessage.id })) {
          return currentMessage;
        }
        return [...currentMessage, newMessage];
      });

      bottomRef?.current?.scrollIntoView();
    };

    // if a user is viewing a message then mark that as seen in real time
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
    pusherClient.bind("messages:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("messages:update", updateMessageHandler);
    };
  }, [conversationId]);
  return (
    <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-[#C5C6C7] scrollbar-track-[#1F2833] rounded-[12px]">
      {messages.map((message, i) => 
        message.lastMessageOfTheContext == true ? (
          console.log("called thissss"),
          <fieldset className="border-t border-slate-300">
            <legend className="mx-auto px-4 text-white text-sm italic">
              context cleared
            </legend>
          </fieldset>
        ) : (
          <MessageBox
            isLast={i === messages.length - 1}
            key={message.id}
            data={message}
          />
        )
      )}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
}