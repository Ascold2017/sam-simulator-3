import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from '../../../shared/models/sockets.model'

class SocketClient {
  private socket: Socket;

  constructor(url: string) {
    this.socket = io(url, {
      path: "/socket.io",
      transports: ["websocket"], // Указываем, что используем только WebSocket
    });
    

    window.addEventListener("beforeunload", () => this.disconnect());
  }

  private disconnect() {
    this.socket.disconnect();
  }

  send<EventName extends keyof ClientToServerEvents>(eventName: EventName, payload: Parameters<ClientToServerEvents[EventName]>[0]): void {
    this.socket.emit(eventName, payload);
  }

  listenToEvent<EventName extends keyof ServerToClientEvents>(eventName: EventName, cb: (payload: Parameters<ServerToClientEvents[EventName]>[0]) => void): void {
    // @ts-ignore
    this.socket.on(eventName, (payload) => {
      cb(payload);
    });
  }
}

export const socketClient = new SocketClient(
  import.meta.env.VITE_APP_SOCKET_URL,
);
