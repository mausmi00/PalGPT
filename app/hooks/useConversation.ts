import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const useConversation = () => {
    const params = useParams();
    let conversationId: String = "";

    if (!params?.conversationId) {
        conversationId = '';
    }

    else {
        conversationId = params.conversationId as string;
    }



    const isOpen = !!conversationId
    return {
        isOpen,
        conversationId
    }
};

export default useConversation;