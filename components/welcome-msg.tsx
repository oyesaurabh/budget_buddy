"use client";

import { useState } from "react";

export default function WelcomeMessage() {
  const [user, setUser] = useState(true);
  return (
    <div className="space-y-2">
      <h2 className="text-2xl lg:text-4xl text-white ">
        Welcome Back{user ? ", " : " "}
        {"saurabh"}👋
      </h2>
      <p className="text-sm lg:text-base text-blue-300">
        This is your Overview Report
      </p>
    </div>
  );
}
