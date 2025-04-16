import React from "react";

const UserList = ({ userList, onDelete, onEdit }) => {
  return (
    <>
      <h3 className="text-[2rem] font-bold text-cyan-700">All Users</h3>
      <div className="w-[95%] mt-2">
        <div className="flex justify-between bg-slate-400 p-2">
          <p>Name</p>
          <p>Age</p>
          <p>Role</p>
          <p>Created At</p>
          <p>Updated At</p>
          <p>Action</p>
        </div>
      </div>
      <div className="w-[95%] flex flex-col bg-lime-200">
        {userList.map((user, index) => (
          <div className="flex justify-between p-2" key={index}>
            <div className="w-[40%] flex justify-between">
              <p>{user.name}</p>
              <p>{user.age}</p>
              <p>{user.role}</p>
            </div>
            <p>{new Date(user.createdAt).toLocaleString()}</p>
            <p>{new Date(user.updatedAt).toLocaleString()}</p>
            <div className="flex gap-2">
              <button
                className="w-fit p-1 rounded-md bg-red-500"
                onClick={() => onDelete(index)}
              >
                Delete
              </button>
              <button
                className="w-fit py-1 px-2 rounded-md bg-green-400"
                onClick={() => onEdit(index)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserList;
