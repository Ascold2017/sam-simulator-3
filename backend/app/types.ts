import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model"
import { Socket } from "socket.io"
import { User } from "./entities/user.entity"

export interface CustomSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
    data: {
        user: User
    }
}