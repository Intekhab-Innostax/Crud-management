import React, { useState, useEffect } from "react";
import User from "./components/User";
import UserList from "./components/UserList";

function App() {
  const [userList, setUserList] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem("userList");
    if (storedUsers) {
      setUserList(JSON.parse(storedUsers));
    }
  }, []);

  const addUser = (newUser) => {
    console.log(editingIndex)
    if (editingIndex !== null) {
      const updatedList = [...userList];
      updatedList[editingIndex] = {
        ...newUser,
        createdAt: updatedList[editingIndex].createdAt,
        updatedAt: new Date().toISOString(),
      };
      setUserList(updatedList);
      localStorage.setItem("userList", JSON.stringify(updatedList));
      setEditingIndex(null);
    } 

    else {
      const updatedList = [...userList, newUser];
      setUserList(updatedList);
      localStorage.setItem("userList", JSON.stringify(updatedList));
    }
  };

  const deleteUser = (indexToDelete) => {
    const updatedList = userList.filter((_, index) => index !== indexToDelete);
    setUserList(updatedList);
    localStorage.setItem("userList", JSON.stringify(updatedList));
  };

  const editHandle = (indexToEdit) => {
    setEditingIndex(indexToEdit);
  };

  return (
    <>
      <div className="w-full min-h-screen bg-slate-200 flex flex-col items-center p-2">
        <h2 className="text-[2rem] font-bold text-cyan-700">User Management</h2>
        <User onAddUser={addUser} userToEdit={editingIndex !== null ? userList[editingIndex] : null} />
        <UserList
          userList={userList}
          onDelete={deleteUser}
          onEdit={editHandle}
        />
      </div>
    </>
  );
}

export default App;
