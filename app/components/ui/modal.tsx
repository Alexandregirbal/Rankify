"use client";

import { useRef, useState } from "react";

export default function Modal({
  children,
  content,
  className,
}: {
  children: JSX.Element;
  content: JSX.Element;
  className?: string;
}) {
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => {
    if (!isFirstOpen) {
      setIsFirstOpen(true);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={openModal} className={className}>
        {children}
      </div>

      {isFirstOpen && (
        <dialog
          open={isOpen}
          ref={dialogRef}
          className="modal"
          onClick={closeModal}
        >
          <div className="modal-box h-3/4" onClick={(e) => e.stopPropagation()}>
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            {content}
          </div>
        </dialog>
      )}
    </>
  );
}
