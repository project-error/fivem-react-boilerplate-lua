import { useEffect, useEffectEvent } from "react";

interface NuiMessageData<T = unknown> {
  action: string;
  data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

const isNuiMessage = <T>(data: unknown): data is NuiMessageData<T> => {
  return (
    typeof data === "object" &&
    data !== null &&
    "action" in data &&
    typeof data.action === "string"
  );
};

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = unknown>(
  action: string,
  handler: NuiHandlerSignature<T>,
) => {
  const onMessage = useEffectEvent((data: T) => {
    handler(data);
  });

  useEffect(() => {
    const eventListener = (event: MessageEvent<unknown>) => {
      if (!isNuiMessage<T>(event.data) || event.data.action !== action) return;

      onMessage(event.data.data);
    };

    window.addEventListener("message", eventListener);
    // Remove Event Listener on component cleanup
    return () => window.removeEventListener("message", eventListener);
  }, [action]);
};
