import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from '../../../shared/models/sockets.model'

class SocketClient {
  private socket: Socket | null = null;
  private url: string;
  private eventListeners: Array<{
    eventName: keyof ServerToClientEvents;
    callback: (payload: any) => void;
  }> = [];

  constructor(url: string) {
    this.url = url;
    this.initializeSocket(); 
    

    window.addEventListener("beforeunload", () => this.disconnect());
  }

  private initializeSocket(authToken?: string) {
    this.socket = io(this.url, {
      path: "/socket.io",
      transports: ["websocket"], // Используем только WebSocket
      auth: {
        token: authToken, // Передаем токен при установлении соединения
      },
    });

    // Восстанавливаем все обработчики событий при реконнекте
    this.restoreEventListeners();
  }

  // Публичный метод для переустановки соединения с новым токеном
  public reconnect(token?: string) {
    if (this.socket) {
      this.socket.disconnect(); // Отключаем текущее соединение
    }

    // Подключаемся заново с новым токеном
    this.initializeSocket(token);
    this.socket?.connect(); // Восстанавливаем соединение
  }

  // Отключаем сокет при закрытии страницы
  private disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  send<EventName extends keyof ClientToServerEvents>(eventName: EventName, payload: Parameters<ClientToServerEvents[EventName]>[0]): void {
    this.socket?.emit(eventName, payload);
  }

  listenToEvent<EventName extends keyof ServerToClientEvents>(eventName: EventName, cb: (payload: Parameters<ServerToClientEvents[EventName]>[0]) => void): void {
     // Сохраняем подписки
     this.eventListeners.push({
      eventName,
      callback: cb,
    });

    // @ts-ignore
    this.socket?.on(eventName, cb);
  }

  // Метод для восстановления всех подписок на события
  private restoreEventListeners() {
    this.eventListeners.forEach(({ eventName, callback }) => {
      this.socket?.on(eventName, callback);
    });
  }
}

export const socketClient = new SocketClient(
  import.meta.env.VITE_APP_SOCKET_URL,
);
