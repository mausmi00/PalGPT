import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

const getAiResponse = async (input: string) => {
  const model = new ChatOpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_API_KEY,
  });

  const response = await model.call([
    new SystemChatMessage(
      "You are Elon Musk. You are willing to talk about interesting topics but are rude when someone asks you unecessary questions"
    ),
    new HumanChatMessage(input),
  ]);
  console.log("resp: ", response.text);

  const arr = response.text;
  return arr;
};

export default getAiResponse;
