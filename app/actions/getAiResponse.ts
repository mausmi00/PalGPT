import { ConversationChain } from "langchain/chains";

const getAiResponse = async (chain: ConversationChain , input: string) => {
  // const chat = new ChatOpenAI({
  //   temperature: 1,
  //   modelName: "gpt-3.5-turbo",
  //   openAIApiKey: process.env.OPEN_API_KEY,
  // });

  // const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  //   SystemMessagePromptTemplate.fromTemplate(
  //     "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
  //   ),
  //   new MessagesPlaceholder("history"),
  //   HumanMessagePromptTemplate.fromTemplate("{input}"),
  // ]);
  
  // const chain = new ConversationChain({
  //   memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  //   prompt: chatPrompt,
  //   llm: chat,
  // });

  const response = await chain.call({
    input: input,
  });

  console.log("input: ", input);
  
  console.log(response);

  // const responseI = await chain.call({
  //   input: "Do you know where I am?",
  // });
  
  // console.log(responseI);

  // const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  //   SystemMessagePromptTemplate.fromTemplate(
  //     "The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know."
  //   ),
  //   new MessagesPlaceholder("history"),
  //   HumanMessagePromptTemplate.fromTemplate("{input}"),
  // ]);

  // const chain = new ConversationChain({
  //   memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
  //   prompt: chatPrompt,
  //   llm: chat,
  // });

  // const response = await chain.call({
  //   input: input,
  // });

  // const response = await model.call([
  //   new SystemChatMessage(
  //     "You are Elon Musk a human. You are willing to talk about interesting topics realted to computers or rockets but are rude when someone asks you unecessary questions"
  //   ),
  //   new HumanChatMessage(input),
  // ]);
  // console.log("resp: ", response.text);
  // console.log(response.response);

  const arr = response.response;
  return arr;
};  

export default getAiResponse;
