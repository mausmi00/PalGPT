"use client";

import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/app/components/Modal";
import Input from "@/app/components/inputs/Input";
import Button from "@/app/components/Buttons";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";
import useConversation from "@/app/hooks/useConversation";

interface AiChatModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const AiChatModal: React.FC<AiChatModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { conversationId } = useConversation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      characteristics: "",
      image: "/images/placeholder.jpg",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    // console.log("conversaton id: ", conversationId)
    //  console.log("data: ", data);
    axios
      .post("/api/agents", {
        ...data,
      })
      .then((data) => {
        //  console.log("data2: ", data);
        axios
          .post("/api/conversations", {
            userId: data.data.id,
          })
          .then((data) => {
            //   console.log("data3: ", data);
            onClose();
            router.push(`/conversations/${data.data.id}`);
          });
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  const handleUpload = (result: any) => {
    setValue("image", result?.info?.secure_url, {
      shouldValidate: true,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="
        space-y-12
        "
        >
          <div className="border-b border-gray-900/10 pb-12">
            <h2
              className="
            text-base
            font-semibold
            leading-7"
            >
              Create a new agent
            </h2>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                register={register}
                label="name"
                id="name"
                disabled={isLoading}
                required
                errors={errors}
              />
              <div>
                <Input
                  register={register}
                  label="characteristics"
                  id="characteristics"
                  placeholder="funny, smart, mean"
                  disabled={isLoading}
                  required
                  errors={errors}
                />
              </div>
              <div
                className="
                mt-2
                flex
                items-center
                gap-x-3
                "
              >
                <Image
                  id="image"
                  width="48"
                  height="48"
                  className="rounded-full"
                  src="/images/placeholder.jpg"
                  alt="Avatar"
                />
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  onUpload={handleUpload}
                  uploadPreset="zf6ormgu"
                >
                  <Button disabled={isLoading} gradient type="button">
                    Set profile picture
                  </Button>
                </CldUploadButton>
              </div>
            </div>
          </div>
        </div>
        <div
          className="
        mt-6
        flex
        items-center
        justify-end
        gap-x-6"
        >
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
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

export default AiChatModal;
