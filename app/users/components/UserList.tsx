"use client";

import { User } from "@prisma/client";
import UserBox from "./UserBox";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface UserListProps {
  initialItems: User[];
  users: User[];
}

const UserList: React.FC<UserListProps> = ({
  initialItems,
  users,
}) => {
  const session = useSession();
  const [items, setItems] = useState(initialItems);

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    // if the session has not loaded yet
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const newHandler = (newPeople: User) => {
      setItems((currentPeople) => {
        if (find(currentPeople, { id: newPeople.id })) {
          return currentPeople;
        }
        return [newPeople, ...currentPeople];
      });
    };

    pusherClient.bind("user:new", newHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("user:new", newHandler);
    };
  }, [pusherKey]);
  return (
    <aside
      className="fixed
        inset-y-0
        pb-20
        lb:pb-0
        lg:left-20
        lg:w-80
        lg:block
        overflow-y-auto scrollbar-thin scrollbar-thumb-[#C5C6C7] scrollbar-track-[#1F2833] rounded-[12px]
        border-r
        border-gray-200
        block
        w-full
        left-0"
    >
      <div className="px-5">
        <div className="flex-col">
          <div
            className=" text-2xl
          font-bold
          py-4"
          >
            Friends
            <hr className="w-48 h-1 my-4 bg-[#66FCF1] border-0 rounded md:my-4" />
          </div>
        </div>
        {users.map((user) => (
          <UserBox key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
};

export default UserList;
