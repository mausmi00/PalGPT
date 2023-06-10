import { useParams } from 'next/navigation';
import { useMemo }  from 'react';
import getIsAiConversation from '../actions/getIsAiConversation';

const useConversation =  () => {
    const params = useParams();

    const conversationId = useMemo(() => {
        if(!params?.conversationId) {
            return '';
        }

        return params.conversationId as string;
    }, [params?.conversationId]);


    const isOpen = useMemo(() => !!conversationId, [conversationId]);
    // const isAiConvo: boolean = JSON.parse(params?.isAiConvo)
    // const isAiConvo = await getIsAiConversation(userId);
   // console.log("is active convo: ", isAiConvo);
    return useMemo(() => ({
        isOpen,
        conversationId        
    }), [isOpen, conversationId]);
};

export default useConversation;