
import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import EmptyState from "@/app/components/EmptyState";
import Header from "./components/Header";
import Body from "./components/Body";
import Form from "./components/Form";
import getIsAiConversation from "@/app/actions/getIsAiConversation";
import AiForm from "./components/AiForm";
import { useRouter } from "next/navigation";

interface IParams {
  conversationId: string;
}

const conversationId = async ({ params }: { params: IParams }) => {

  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const isAiConvo = await getIsAiConversation(params.conversationId);
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  if(isAiConvo) { 
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <Header conversation={conversation} />
          <Body initialMessages={messages} /> 
          <AiForm/>
          
        </div>
        </div>
    );
  } else {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <Header conversation={conversation} />
          <Body initialMessages={messages} /> 
          <Form />
        </div>
      </div>
    );
  }
};

export default conversationId;
