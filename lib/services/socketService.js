import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect(token) {
    this.socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Tracking events
  joinTrackingRoom(appointmentId) {
    this.socket?.emit("tracking:join", { appointmentId });
  }

  leaveTrackingRoom(appointmentId) {
    this.socket?.emit("tracking:leave", { appointmentId });
  }

  onTrackingStarted(callback) {
    this.socket?.on("tracking:started", callback);
  }

  onLocationUpdate(callback) {
    this.socket?.on("location:update", callback);
  }

  onProviderArrived(callback) {
    this.socket?.on("provider:arrived", callback);
  }

  onTrackingStopped(callback) {
    this.socket?.on("tracking:stopped", callback);
  }

  // Cleanup
  offTrackingEvents() {
    this.socket?.off("tracking:started");
    this.socket?.off("location:update");
    this.socket?.off("provider:arrived");
    this.socket?.off("tracking:stopped");
  }
}

export default new SocketService();