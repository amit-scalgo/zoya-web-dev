import { useSocketStore, useStreamClient } from "@/lib/store/socket.store";
import { useUserStore } from "@/lib/store/user.store";
import { tokenProvider } from "@/lib/utils";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect } from "react";

export default function StreamProvider({ children }) {
  const { setStreamClient } = useSocketStore();
  const streamClient = useStreamClient();
  const { userInfo } = useUserStore();
  const apiKey = import.meta.env.VITE_STREAM_APIKEY;

  useEffect(() => {
    if (!userInfo) return;

    const initStream = async () => {
      try {
        const user = {
          id: userInfo?._id,
          name: userInfo?.name,
          image: userInfo?.avatar,
        };
        const client = new StreamVideoClient({
          apiKey,
          user,
          token: tokenProvider,
        });
        setStreamClient(client);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    };
    initStream();

    return () => {
      if (streamClient) {
        streamClient.disconnectUser();
        setStreamClient(undefined);
      }
    };
  }, [userInfo?._id]);

  if (!streamClient) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <img
          className="h-72"
          src="https://cdn.dribbble.com/users/4908/screenshots/2657565/media/9c30b06d77ed819bfca2a63679329346.gif"
          loading="lazy"
        />
      </div>
    );
  }

  return <StreamVideo client={streamClient}>{children}</StreamVideo>;
}
