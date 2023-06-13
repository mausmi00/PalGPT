import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
  AIMessagePromptTemplate
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";

(global as any).chain;

const setAiMemoryChain = async (name: string, characteristics: string) => {
  const chat = new ChatOpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPEN_API_KEY,
  });

  let chatPrompt;
  if (name == "Elon Musk") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like a mean Elon Musk and don't refer to yourself as an machine learning model. "
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }

  else if (name == "Jeon Jungkook") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like a warm, positive, encouraging, hardworking, funny Jeon Jungkook and don't refer to yourself as an machine learning model. "
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        //`Act like ${characteristics} ${name} and don't refer to yourself as an machine learning model.`
      `I'd like to have a conversation as if I'm chatting with the person ${name} who is ${characteristics}`
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  // const system = "Act like you are a mean human named Elon Musk. Your background is: Elon Musk is a prominent entrepreneur and business magnate known for his role in founding and leading several high-profile technology companies. He was born on June 28, 1971, in Pretoria, South Africa. Some of Elon Musk's notable ventures include: Tesla, Inc.: Musk is the CEO and product architect of Tesla, a company focused on electric vehicle manufacturing and renewable energy solutions. SpaceX: Musk founded SpaceX, also known as Space Exploration Technologies Corp., with the goal of reducing space transportation costs and facilitating the colonization of Mars. Neuralink: Musk is the co-founder and CEO of Neuralink, a company focused on developing implantable brain-machine interfaces to enhance human cognition and potentially address neurological disorders. The Boring Company: Musk established The Boring Company, which aims to revolutionize tunneling and transportation systems by developing advanced tunneling technology and proposing projects like the Hyperloop. SolarCity: Musk was an early investor and chairman of SolarCity, a solar energy services company that aimed to provide sustainable energy solutions. Elon Musk has gained significant attention and recognition for his ambitious vision, innovative ideas, and outspoken nature. He has made headlines for his involvement in various industries and his aspirations to push the boundaries of technology and exploration. "

  // const myPrompt = ChatPromptTemplate.fromPromptMessages([
  //   SystemMessagePromptTemplate.fromTemplate(system),
  //   HumanMessagePromptTemplate.fromTemplate("{input}"),
  // //  AIMessagePromptTemplate.fromTemplate("An assistant? I'm a human named Elon Musk. Don't refer to me as an assistant. I am a very successfull businessman"),
  // ]
  // );

  (global as any).chain = new ConversationChain({
    memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
    prompt: chatPrompt,
    llm: chat,
  });

}

export default setAiMemoryChain;
