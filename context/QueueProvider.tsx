import React, { useState, useContext, createContext } from "react";
import { useUrl } from "./UrlProvider";
import axios from "axios";

const QueueContext = createContext<any>(null);

export const QueueProvider = ({ children }: any) => {
  const [queue, setQueue] = useState([]);
  const { ipAddress, port } = useUrl();

  const queueWebSocket = () => {
    const socket = new WebSocket(`ws://${ipAddress}:${port}/api/queue`);

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error: ", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
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
      let url = `http://${ipAddress}:${port}/api/queue/${queueId}`;

      let response = await axios.delete(url);

      if (response.status === 200) {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addtoQueue = async ({
    userId,
    lon,
    lat,
    locationName,
    status,
  }: {
    userId: string;
    lon: number;
    lat: number;
    locationName: string;
    status: string;
  }) => {
    try {
      let url = `http://${ipAddress}:${port}/api/queue`;

      let response = await axios.post(url, {
        userId: userId,
        location: {
          lon: lon,
          lat: lat,
          locationName: locationName,
        },
        status: status,
      });
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  return (
    <QueueContext.Provider
      value={{ queue, queueWebSocket, deleteFromQueue, addtoQueue }}
    >
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);
