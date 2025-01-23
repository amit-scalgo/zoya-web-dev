import { newRequest } from "@/endpoints";
import { GENERATE_STREAM_TOKEN } from "@/endpoints/chat";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const tokenProvider = async () => {
  const response = await newRequest(GENERATE_STREAM_TOKEN);
  if (response.status === 200) {
    return response.data.token;
  } else {
    throw new Error("Failed to generate stream token");
  }
};

export const scrollToBottom = () => {
  const scrollableDiv = document.getElementById("scrollableDiv");
  if (scrollableDiv) {
    setTimeout(() => {
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
    }, 0);
  } else {
    console.error("Scrollable div is not set or does not exist.");
  }
};
