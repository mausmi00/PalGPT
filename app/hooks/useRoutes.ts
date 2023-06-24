import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HiChat } from 'react-icons/hi';
import { MdOutlineEmojiPeople } from 'react-icons/md';
import { RiChatSmile3Fill } from 'react-icons/ri';
import { FiFrown } from 'react-icons/fi';
import { BsRobot } from "react-icons/bs";
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
            label: 'chats',
            href: '/conversations',
            icon: RiChatSmile3Fill,
            active: pathname === '/conversations' || !!conversationId
        },
        {
            label: 'users',
            href: '/users',
            icon: MdOutlineEmojiPeople,
            active: pathname === '/users'
        },
        {
            label: 'agents',
            href: '/agents',
            icon: BsRobot,
            active: pathname === '/agents'
        },
        {
            label: 'Logout',
            href: '#',
            onClick: () => signOut(),
            icon: FiFrown
        },

    ], [pathname, conversationId]);

    return routes;
}

export default useRoutes;