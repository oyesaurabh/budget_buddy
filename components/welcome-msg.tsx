"use client";

import { useEffect, useState } from "react";

export default function WelcomeMessage() {
  const [user, setUser] = useState("");
  useEffect(() => {
    const username = localStorage.getItem("username") || "";
    setUser(username);
  }, []);
  return (
    <div className="space-y-2">
      <h2 className="text-2xl md:text-4xl text-white">
        Welcome Back{user ? `, ${user}` : ""}👋
      </h2>
    </div>
  );
}
