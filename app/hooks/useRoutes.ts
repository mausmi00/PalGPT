import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HiChat } from 'react-icons/hi';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { RiChatSmile3Fill } from 'react-icons/ri';
import { FiFrown } from 'react-icons/fi';
import {
    HiArrowLeftOnRectangle,
    HiUsers
} from "react-icons/hi2";
import { signOut } from "next-auth/react";

import useConversation from './useConversation';
MdOutlineEmojiPeople
const useRoutes = () => {
    const pathname = usePathname();
    const { conversationId } = useConversation();

    const routes = useMemo(() => [
        {
            label: 'Chat',
            href: '/conversations',
            icon: RiChatSmile3Fill,
            active: pathname === '/conversations' || !!conversationId
        },
        {
            label: 'Users',
            href: '/users',
            icon: MdOutlineEmojiPeople,
            active: pathname === '/users'
        },
        {
            label: 'Logout',
            href: '#',
            onClick: () => signOut(),
            icon: FiFrown
        }

    ], [pathname, conversationId]);

    return routes;
}

export default useRoutes;