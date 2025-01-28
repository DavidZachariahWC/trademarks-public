// /app/ai-chat/newComponents/message.tsx

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import { BotIcon, UserIcon } from "./icons";
import { Markdown } from "./markdown";

interface MessageProps {
  chatId: string;
  role: string;
  content: string | ReactNode;
}

export const Message = ({
  chatId,
  role,
  content,
}: MessageProps) => {
  return (
    <motion.div
      className="flex flex-row gap-4 px-8 w-full md:px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="size-[36px] border rounded-sm p-2 flex flex-col justify-center items-center shrink-0 text-zinc-500">
        {role === "assistant" ? <BotIcon /> : <UserIcon />}
      </div>

      <div className="flex flex-col w-full -mt-[8px]">
        {content && typeof content === "string" ? (
          <div className="text-zinc-900">
            <Markdown>{content}</Markdown>
          </div>
        ) : (
          <div className="text-zinc-900">
            {content}
          </div>
        )}
      </div>
    </motion.div>
  );
};
