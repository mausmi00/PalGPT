import { ConversationChain } from "langchain/chains";
import { NextResponse } from "next/server";

const getAiResponse = async (chain: ConversationChain, input: string) => {
  try {
    const response = await chain.call({
      input: input,
    });
    console.log("inside get ai response input: ", input)
    console.log("inside get ai response: ", response.response)
    // console.log("input: ", input);

    // console.log(response);

    const arr = response.response;
    // for(;;) {
    //   console.log("does this timeout")
    // }
    return arr;
  } catch (error: any) {
    console.log(error, 'ERROR_AI_RESPONSE');
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export default getAiResponse;
