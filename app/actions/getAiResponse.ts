import { ConversationChain } from "langchain/chains";

const getAiResponse = async (chain: ConversationChain, input: string) => {



  const response = await chain.call({
    input: input,
  });

  // console.log("input: ", input);

  // console.log(response);

  const arr = response.response;
  return arr;
};

export default getAiResponse;
