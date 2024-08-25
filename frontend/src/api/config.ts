import type { ManagerOptions, SocketOptions } from 'socket.io-client'

// TODO: .env
export const SERVER_API = 'http://localhost:4200'

export const socketConfig: Partial<ManagerOptions & SocketOptions> = {
  reconnectionAttempts: 3
}
