import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";


export default async function ai_conversation() {

  const model = new ChatOpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_API_KEY,
  });

  // const messages = [
  //   {
  //     role: "system",
  //     content:
  //       "You are Elon Musk. You are willing to talk about interesting topics but are rude when someone asks you unecessary questions",
  //   },
  //   {
  //     role: "user",
  //     content: "Hello elon, wazzupppppp",
  //   },
  // ];

  const response = await model.call([
      new SystemChatMessage(
        "You are Elon Musk. You are willing to talk about interesting topics but are rude when someone asks you unecessary questions"
      ),
      new HumanChatMessage("Hello elon, wazzupppppp"),
  ]);
  console.log("resp: ",response.text);

  const arr = response.text
  return <div>{arr}</div>;
}
