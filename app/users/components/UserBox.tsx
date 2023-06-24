import Avatar from "@/app/components/Avatar";
import LoadingModal from "@/app/components/LoadingModal";
import { User } from "@prisma/client";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface UserBoxProps {
  user: User;
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = useCallback(() => {
    setIsLoading(true);
    let id: string = "";
    axios
      .post("/api/conversations", {
        userId: user.id,
      })
      .then((data) => {
        axios.get(`/api/conversations/${data.data.id}`);
      }).then(() => {
      router.push(`/conversations/${id}`);
    })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [user, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleOnClick}
        className="
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3
        hover:bg-[#66FCF1]
        hover:opacity-100
        hover:text-[#1F2833]
        rounded-lg
        transition
        cursor-pointer
        bg-[#1F2833]
        text-white"
      >
        <Avatar user={user} />
        <div
          className="
      min-w-0 flex-1"
        >
          <div className=" focus:outline-none">
            <div
              className="flex
            justify-between
            items-center
            mb-1"
            >
              <p
                className="
                text-sm
                font-medium"
              >
                {user.name}
              </p>
            </div>
            <p className="text-xs font-light">{user.characteristics}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
