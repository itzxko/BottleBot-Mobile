import React, { useState, useContext, createContext, useEffect } from "react";
import { useUrl } from "./UrlProvider";
import axios from "axios";

const QueueContext = createContext<any>(null);

export const QueueProvider = ({ children }: any) => {
  const [queue, setQueue] = useState([]);
  const { ipAddress, port, urlString } = useUrl();
  const [queueModal, setQueueModal] = useState(false);

  useEffect(() => {
    const initializeQueue = async () => {
      await queueWebSocket();
    };

    initializeQueue();
  }, []);

  const queueWebSocket = () => {
    const socket = new WebSocket(`${urlString}/api/queue`);

    socket.onopen = () => {
      console.log("Queue WebSocket connection opened");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("Queue WebSocket connection closed");
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);

      if (response.success && response.realTimeType === "queue") {
        setQueue(response.data);
      }
    };
  };

  const deleteFromQueue = async (queueId: string) => {
    try {
      let url = `${urlString}/api/queue/${queueId}`;

      let response = await axios.delete(url);

      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <QueueContext.Provider
      value={{
        queue,
        queueWebSocket,
        deleteFromQueue,
        queueModal,
        setQueueModal,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
