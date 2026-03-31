import { useState } from "react";
import Inbox from "./Inbox";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Login } from "./Login";

export default function App(){
  const [username, setUsername] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login username={username} setUsername={setUsername} />} />
        <Route path="/inbox" element={<Inbox username={username} setUsername={setUsername} />} />
      </Routes>
    </BrowserRouter>
  );
}


