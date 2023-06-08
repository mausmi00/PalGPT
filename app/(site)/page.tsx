import Image from "next/image";
import AuthForm from "./components/AuthForm";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

export default function Home() {
  return (
    <div
      className="
    flex
    min-h-full
    flex-col
    justify-center
    py-12
    sm:px-6
    lg:px-8
    bg-gray-100
    "
    >
      <div className=" sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          alt="Logo"
          height="48"
          width="48"
          className="mx-auto w-auto"
          src="/images/logo.png"
        />
        <h2
          className="
      mt-6
      text-center
      text-3xl
      font-bold
      tracking-tight
      text-gray-900"
        >
          Sign in to your account
        </h2>
      </div>
      <AuthForm />
    </div>
  );
}

// export default async function AI() {

//   const model = new ChatOpenAI({
//     temperature: 1,
//     modelName: "gpt-3.5-turbo",
//     openAIApiKey: process.env.OPEN_API_KEY,
//   });

//   const messages = [
//     {
//       role: "system",
//       content:
//         "You are Elon Musk. You are willing to talk about interesting topics but are rude when someone asks you unecessary questions",
//     },
//     {
//       role: "user",
//       content: "Hello elon, wazzupppppp",
//     },
//   ];

//   const response = await model.call([
//       new SystemChatMessage(
//         "You are Elon Musk. You are willing to talk about interesting topics but are rude when someone asks you unecessary questions"
//       ),
//       new HumanChatMessage("Hello elon, wazzupppppp"),
//   ]);
//   console.log("resp: ",response.text);

//   const arr = response.text
//   return <div>{arr}</div>;
// }
