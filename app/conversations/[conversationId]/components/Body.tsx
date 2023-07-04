"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/app/libs/pusher";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  // defualt: last message is a regular user
 // const [lastMessageIsAi, setLastMessageIsAi] = useState(!lastMessage.responderShouldBeAi)

 // would be true if we want to enable users to send more messages
  // global.shouldDisplay = !lastMessage?.responderShouldBeAi;

  const { conversationId } = useConversation();

  // is true if the messages are part of conversation with an agent
  const isAiConvo = messages[0]?.isAiConvoMessage;
  useEffect(() => {
    isAiConvo ? router.refresh() : axios.post(`/api/conversations/${conversationId}/seen`)
     
  }, [conversationId, isAiConvo, router]);

  // useEffect(() => {
  //   router.refresh();
  // }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
     axios.post(`/api/conversations/${conversationId}/seen`)
     .catch(() => toast.error("Something went wrong!"));
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
      //router.refresh();
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

  // useEffect(() => {
  //   console.log("update should display: ", global.shouldDisplay)
  //   // setLastMessageIsAi(!message.responderShouldBeAi);
  //  // global.shouldDisplay  = !message.responderShouldBeAi;
  // }, [messages])
  let lastMessage = messages[messages.length - 1];
  useEffect(() => {
    global.shouldDisplay = !lastMessage?.responderShouldBeAi || lastMessage.lastMessageOfTheContext;
    // console.log("should disp val: ", global.shouldDisplay)  
  }, [lastMessage])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <>
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
        </>
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
