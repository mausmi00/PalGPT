"use client";

import useConversation from "@/app/hooks/useConversation";
import { FullMessageType } from "@/app/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { Message } from "@prisma/client";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  console.log("initial messages: ", initialMessages);
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
    router.push(`/conversations/${conversationId}`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (newMessage: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      // if the current messages already has the new message (the id is the same) then we don't add it to the
      //collection of messages
      // setMessages((currentMessage) => {
      //   if (find(currentMessage, { id: newMessage.id })) {
      //     console.log("current message1: ", currentMessage)
      //     return currentMessage;
      //   }
      //   console.log("current & new message: ", [...currentMessage, newMessage])
      //   return [...currentMessage, newMessage];
      // });

      
        if (find(messages, { id: newMessage.id })) {
          setMessages(messages);
           console.log("initial message1: ", messages) 
        }
        else {
          const combineMessage = [...messages, newMessage];
          setMessages(combineMessage)
          console.log("initial message2: ", messages)
        }

      bottomRef?.current?.scrollIntoView();
    };

    // if a user is viewing a message then mark that as seen in real time
    const updateMessageHandler = (newMessage: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);
      // setMessages((current) =>
      //   current.map((currentMessage) => {
      //     console.log("currentmessage: ", currentMessage.id)
      //     console.log("new message: ", newMessage.id)
      //     if (currentMessage.id === newMessage.id) {
      //       return newMessage;
      //     }
      //     return currentMessage;
      //   })
      // );

      messages.map((message) => {
        if(message.id === newMessage.id) {
          const combineMessage = [...messages, newMessage];
          setMessages(combineMessage)
          console.log("initial message3: ", messages) 
        }
        else {
          setMessages(messages);
          console.log("initial message4: ", messages) 
        }
      });

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
      {messages.map((message, i) => (
        <>
          <MessageBox
            isLast={i === messages.length - 1}
            key={message.id}
            data={message}
          />
        </>
      ))}

      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
