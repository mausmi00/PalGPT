"use client";

import useConversation from "@/app/hooks/useConversation";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "@/app/components/Modal";

interface ConfirmModelProps {
  isOpen?: boolean;
  onClose: () => void;
}
const ConfirmModel: React.FC<ConfirmModelProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`/api/conversations/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/conversations");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div></div>
      </div>
    </Modal>
  );
};

export default ConfirmModel;
