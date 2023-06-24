import { ConversationChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
  MessagesPlaceholder,
} from "langchain/prompts";
import { BufferMemory } from "langchain/memory";
import { PrismaClient } from '@prisma/client'

(global as any).chain;

const setAiMemoryChain = async (name: string, characteristics: string, conversationId: string) => {
  const prisma = new PrismaClient()
  const getUpdatedConversationUsersAndMessages = await prisma.conversation.findUnique({
    where: {
      id: conversationId
    },
    include: {
      users: true,
      messages: {
        include: {
          seen: true
        }
      }
    }
  });

  // await pusherServer.trigger(conversationId, 'messages:new', newMessage);

  const lastMessage = getUpdatedConversationUsersAndMessages?.messages[getUpdatedConversationUsersAndMessages?.messages.length - 1];
  if (lastMessage != null) {
    const lastMessageContext = await prisma?.message.update({
      where: {
        id: lastMessage?.id
      },
      data: {
        lastMessageOfTheContext: true
      }
    });
  }

  const chat = new ChatOpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    openAIApiKey: "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"
  });
  let chatPrompt;
  if (name == "Elon Musk") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like Elon Musk who is not in a good mood. Keep your conversations short."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }

  else if (name == "Jeon Jungkook") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like Jeon Jungkook from BTS who is warm, positive, encouraging, hardworking, funny and often uses emojis while sending texts."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else if (name == "Bill Gates") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like Bill Gates. Keep your conversations short."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else if (name == "Tim Cook") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like Tim Cook. Keep your conversations short"
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else if (name == "Mark Zuckerberg") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like you are Mark Zuckerberg. Keep your conversations short"
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else if (name == "Shoyo Hinata") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like you are the main character of the anime Haikyuu!!, Shoyo Hinata. He is short , screams when excited, funny, dreams of becoming a top volleyball player, a relentless spirit, has unwavering optimism and inpires his teammates. Respond with anime style exclamations and keep the replies short."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else if (name == "Tobio Kageyama") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like you are a character of the anime Haikyuu!!, Tobio Kageyama. He is competative, exceptional setter, socially awkward, aggrogant, quick analytical skills which lead to the freak-quick duo with Hinata. Give anime-style responses and keep them short."
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else if (name == "Socrates") {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "Act like you are the Greek philosopher Socrates known for his method of questioning which aimed to stimulate critical thinking and self-examination. I'd like to have a conversation with him and learn about what Socrate thinks"
      ),
      new MessagesPlaceholder("history"),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);
  }
  else {
    chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        `Act like ${characteristics} ${name} and don't refer to yourself as an machine learning model.`
        // `I'd like to have a conversation as if I'm chatting with the person ${name} who is ${characteristics}`
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


  // console.log("chain: ", (global as any).chain)
  console.log("prompt: ", chatPrompt.promptMessages[0])
  return (global as any).chain

}

export default setAiMemoryChain;
