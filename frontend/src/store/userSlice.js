import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
  userList: JSON.parse(localStorage.getItem("userList")) || [],
};
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser(state, action) {
      const updatedList = [...state.userList, action.payload];
      state.userList.push(action.payload);
      localStorage.setItem("userList", JSON.stringify(updatedList));
      toast.success("User Created Successfully");
    },
    deleteUser(state, action) {
      const indexToDelete = action.payload;
      state.userList = state.userList.filter(
        (_, index) => index !== indexToDelete
      );
      localStorage.setItem("userList", JSON.stringify(state.userList));
      toast.success("User deleted Successfully");
    },
    editUser(state, action) {
      const updatedUser = {
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
      const index = state.userList.findIndex((user) => user.id === updatedUser.id);

      if (index !== -1) {
        state.userList[index] = updatedUser;
      }
      localStorage.setItem("userList", JSON.stringify(state.userList));
      toast.success("User Updated Successfully");
    },
  },
});

export const { addUser, deleteUser, editUser } = userSlice.actions;
export default userSlice.reducer;
