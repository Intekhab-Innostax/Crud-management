import React, { useState, useEffect } from "react";
import UserList from "./components/UserList";

function App() {

  return (
    <>
      <div className="w-full min-h-screen bg-slate-200 flex flex-col items-center p-2">
        <h2 className="text-[2rem] font-bold text-cyan-700">User Management App</h2>
        <UserList/>
      </div>
    </>
  );
}

export default App;
