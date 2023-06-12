import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";

const setAiMemoryChain = async () => {
  const chat = new ChatOpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_API_KEY,
  });

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
    ),
    new MessagesPlaceholder("history"),
    HumanMessagePromptTemplate.fromTemplate("{input}"),
  ]);
  
  const chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
  });

  async function processInput(input: string) {
    const res = await chain.call({ input });
    console.log(res);
  }

  return chain;
//   const responseH = await chain.call({
//     input: input,
//   });
  
//   console.log(responseH);
}

export default setAiMemoryChain;
