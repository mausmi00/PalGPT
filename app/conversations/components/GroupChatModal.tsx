"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Select from "@/app/components/inputs/Select";
import Button from "@/app/components/Buttons";
import { User } from "@prisma/client";

interface GroupChatModalProps {
  isOpen?: boolean;
  users: User[];
  onClose: () => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  isOpen,
  users,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      mambers: [],
    },
  });

  const members = watch("members");
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/conversations", {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="
        space-y-12
        text-white
        "
        >
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
            text-base            
            font-semibold
            leading-7"
            >
              Create a group chat
            </h2>
            <p
              className="
            mt-1
            text-sm
            leading-6"
            >
              Create a chat with 2 or more people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                register={register}
                label="name"
                id="name"
                disabled={isLoading}
                required
                errors={errors}
              />
              <Select
                disabled={isLoading}
                label="Members"
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, { shouldValidate: true })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div
          className="
        mt-6
        flex
        items-center
        justify-end
        gap-x-6
        "
        >
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            text-white
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit" secondary>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
