import { io, Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SOCKET_URL = (() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL?.trim();
    if (socketUrl) {
        // Same origin as the API is expected (and required) when the backend is a
        // single always-on Node process serving both REST and Socket.IO (Render),
        // as opposed to a serverless API that can never hold a socket open (Vercel).
        return socketUrl.replace(/\/+$/, '');
    }

    if (API_URL && /localhost|127\.0\.0\.1|\[::1\]/.test(API_URL)) {
        return API_URL.replace(/\/api\/?$/, '');
    }

    return null;
})();

class ClientSocketService {
    public socket: Socket | null = null;
    private connectedToken: string | null = null;
    private authFailed = false;
    private consecutiveErrors = 0;

    public connect(token: string) {
        if (!token) {
            return;
        }

        if (!SOCKET_URL) {
            if (process.env.NODE_ENV === 'production') {
                console.warn('NEXT_PUBLIC_SOCKET_URL is not set; realtime notifications are disabled.');
            }
            this.disconnect();
            return;
        }

        // Don't keep retrying with a token that already failed auth
        if (this.authFailed && this.connectedToken === token) {
            return;
        }

        if (this.socket && this.connectedToken === token) {
            if (!this.socket.connected) {
                this.authFailed = false;
                this.socket.io.opts.reconnection = true;
                this.socket.connect();
            }
            return;
        }

        this.disconnect();

        this.connectedToken = token;
        this.authFailed = false;
        this.consecutiveErrors = 0;
        this.socket = io(SOCKET_URL, {
            auth: { token },
            withCredentials: true,
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 2000,
            reconnectionDelayMax: 10000,
            timeout: 20000,
        });

        this.socket.on('connect', () => {
            this.authFailed = false;
            this.consecutiveErrors = 0;
            console.log('Connected to socket server', this.socket?.id);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        this.socket.on('connect_error', (err) => {
            if (err.message === 'Authentication error') {
                // Stop retrying immediately — same token won't suddenly become valid
                this.authFailed = true;
                if (this.socket?.io) {
                    this.socket.io.opts.reconnection = false;
                }
                return;
            }

            // Any other persistent failure (e.g. host doesn't serve /socket.io at
            // all) — give it one retry for transient blips, then stop rather than
            // burning through all reconnectionAttempts every page load.
            this.consecutiveErrors += 1;
            if (this.consecutiveErrors >= 2 && this.socket?.io) {
                this.socket.io.opts.reconnection = false;
            }
        });
    }

    public disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
        this.connectedToken = null;
        this.authFailed = false;
        this.consecutiveErrors = 0;
    }
}

export const socketService = new ClientSocketService();
