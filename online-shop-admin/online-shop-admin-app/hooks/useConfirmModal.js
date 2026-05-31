// React state hook
import { useState } from "react";
// Reusable modal UI component
import ConfirmModal from "@/components/ConfirmModal";

export function useConfirmModal() {

  // Tracks whether modal is visible
  const [isOpen, setIsOpen] = useState(false);

  // Text message displayed inside modal
  const [message, setMessage] = useState("");

  // Function that runs when user clicks "Confirm"
  // Default is an empty function to avoid crashes
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  // --------------------------------------------------
  // Trigger modal from anywhere in your component
  // --------------------------------------------------
  const confirm = (msg, callback) => {
    setMessage(msg);              // set modal message
    setOnConfirm(() => callback); // store confirm action
    setIsOpen(true);              // open modal
  };

  // --------------------------------------------------
  // Returned modal element to render in JSX
  // --------------------------------------------------
  const Modal = () => (
    <ConfirmModal
      show={isOpen}
      message={message}
      onConfirm={onConfirm}
      onClose={() => setIsOpen(false)} // closes modal
    />
  );

  // Hook returns:
  // - confirm(): opens modal + sets callback
  // - Modal: UI component to render
  return { confirm, Modal };
}
