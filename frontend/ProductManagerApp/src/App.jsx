import "./App.css";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import io from 'socket.io-client';
import { useState ,useEffect } from "react";

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signUp/SignUp";

const socket = io("http://localhost:8000");


const router = createBrowserRouter([
  { path: "/dashboard", element: <Home /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit("message", { from: "frontend", text: "Hello server!" });
    });
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    socket.on('message', data => {
      setLastMessage(data);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('message');
    };
  }, []);
   return (
    <>
      <RouterProvider router={router} />
      <div style={{ padding: 10, background: "#eee" }}>
        <p>Connected: {String(isConnected)}</p>
        <p>Last Message: {lastMessage ? JSON.stringify(lastMessage) : "No messages yet"}</p>
      </div>
    </>
  );
}

export default App;
