import { ReactNode } from "react";

interface IconButtonProps {
  icon: ReactNode;
  onClick: () => void;
  activated: boolean;
}

export function IconButton({ icon, onClick, activated }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-lg
        transition-all duration-150
        cursor-pointer
        ${
          activated
            ? "bg-violet-100 text-violet-600 ring-2 ring-violet-500"
            : "bg-white text-neutral-700 hover:bg-neutral-100"
        }
      `}
    >
      {icon}
    </button>
  );
}
