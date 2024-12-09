"use client";

import { useRef, useState } from "react";

export default function Modal({
  children,
  content,
  title,
  className,
}: {
  children: JSX.Element;
  content: JSX.Element;
  title?: string;
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
          className="modal bg-neutral bg-opacity-20"
          onClick={closeModal}
        >
          <div
            className="modal-box h-3/4 flex flex-col p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              id="modal-title"
              className="text-2xl w-full text-center font-bold pb-4"
            >
              {title}
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <div id="content" className="grow overflow-y-scroll">
              {content}
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
