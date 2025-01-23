import { useEffect, useState, useRef, useCallback } from "react";
import { StreamCall, StreamTheme, useCalls } from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { CallUi } from "./CallUi";

const generateTabId = () => {
  const id = `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem("tabId", id);
  return id;
};

const getStoredTabId = () => sessionStorage.getItem("tabId") || generateTabId();

export const CallScreen = () => {
  const calls = useCalls();
  const call = calls[0];
  const [ongoingCall, setOngoingCall] = useState(() => {
    const savedCall = localStorage.getItem("ongoingCall");
    return savedCall ? JSON.parse(savedCall) : null;
  });
  const [callStatus, setCallStatus] = useState(
    () => localStorage.getItem("callStatus") || "",
  );

  const currentTabIdRef = useRef(getStoredTabId());

  const handleStorageChange = useCallback((event) => {
    if (event.key === "ongoingCall") {
      setOngoingCall(JSON.parse(event.newValue || "null"));
    } else if (event.key === "callStatus") {
      setCallStatus(event.newValue || "");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [handleStorageChange]);

  useEffect(() => {
    if (call) {
      if (!ongoingCall || ongoingCall.tabId !== currentTabIdRef.current) {
        const callState = {
          id: call.id,
          status: "ongoing",
          tabId: currentTabIdRef.current,
        };
        localStorage.setItem("ongoingCall", JSON.stringify(callState));
        setOngoingCall(callState);
      }
    } else if (ongoingCall && ongoingCall.tabId === currentTabIdRef.current) {
      localStorage.removeItem("ongoingCall");
      localStorage.removeItem("callStatus");
      setOngoingCall(null);
      setCallStatus("");
    }
  }, [call]);

  const handleAnswerCall = useCallback(() => {
    const callState = {
      id: call?.id,
      status: "answered",
      tabId: currentTabIdRef.current,
    };
    localStorage.setItem("ongoingCall", JSON.stringify(callState));
    localStorage.setItem("callStatus", "answered");
    setOngoingCall(callState);
    setCallStatus("answered");
  }, [call]);

  if (!call) return null;

  const isCallAnsweredInAnotherTab =
    callStatus === "answered" && ongoingCall?.tabId !== currentTabIdRef.current;

  return isCallAnsweredInAnotherTab ? (
    <CallMonitoringScreen />
  ) : (
    <div className="absolute inset-0 z-[52] h-screen min-h-fit w-full bg-white py-10 md:bg-black/30">
      <StreamCall call={call}>
        <StreamTheme>
          <CallUi
            call={call}
            setCallStatus={setCallStatus}
            setOngoingCall={setOngoingCall}
            handleAnswerCall={handleAnswerCall}
          />
        </StreamTheme>
      </StreamCall>
    </div>
  );
};

const CallMonitoringScreen = () => (
  <div className="absolute inset-0 z-[52] flex h-screen items-center justify-center bg-black/20">
    <div className="flex max-w-xl flex-col items-center justify-center rounded-xl bg-white px-7 py-10 text-center">
      <h2 className="text-xl font-bold">Call is active in another Tab</h2>
      <p className="mt-4 max-w-sm text-sm">
        The call has been answered in another tab. so please switch back to
        previous tab for better call quality
      </p>
      <a
        className="mt-7 flex h-9 w-fit items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        href="/"
      >
        Go to home
      </a>
    </div>
  </div>
);
