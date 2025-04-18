import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addUser, editUser, deleteUser } from "../store/userSlice";
import { v4 as uuidv4 } from "uuid";

const UserList = () => {
  const dispatch = useDispatch();
  const { userList } = useSelector((state) => state.users);
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState(null);
  const [errors, setErrors] = useState({});
  const [userToEdit, setUserToEdit] = useState(null);
  const [search,setSearch] = useState();
  const [searchTerm, setSearchTerm] = useState();

  useEffect(() => {
    let updatedData = [...userList];

    if(searchTerm){
      console.log("searchTerm: ", searchTerm);
      updatedData = updatedData.filter((userData) => userData.name.toLowerCase().includes(searchTerm));
    }
    if (sortType) {
      switch (sortType) {
        case "name":
          updatedData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "age":
          updatedData.sort((a, b) => a.age - b.age);
          break;
      }
    }
    setData(updatedData);
  }, [userList, sortType, searchTerm]);

  const initialValues = userToEdit || {
    name: "",
    age: "",
    role: "member",
  };

  const UserSchema = Yup.object().shape({
    name: Yup.string().min(2, "Too Short!").required("Required"),
    age: Yup.number()
      .typeError("Age must be a number")
      .min(18, "You must be atleast 18 years old")
      .max(100, "You cannot be older than 100 years")
      .required("Required"),
  });

  const deletehandler = (idx) => {
    dispatch(deleteUser(idx));
  };

  const editHandler = (user) => {
    setUserToEdit(user);
    setIsOpen(true);
  };

  const cancelHandler = () => {
    setUserToEdit(null);
    setIsOpen(false);
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      await UserSchema.validate(values, { abortEarly: false });
      console.log("form submit", values);
      const timestamp = new Date().toISOString();

      const newUser = {
        ...values,
        id: userToEdit ? userToEdit.id : uuidv4(),
        createdAt: userToEdit ? userToEdit.createdAt : timestamp,
        updatedAt: timestamp,
      };

      {
        userToEdit ? dispatch(editUser(newUser)) : dispatch(addUser(newUser));
      }

      setUserToEdit(null);
      setIsOpen(false);
      resetForm();
      console.log("form data after", newUser);
      setErrors({});
    } catch (error) {
      const newErrors = {};

      error.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="w-[90%] max-w-md bg-lime-200 rounded-lg shadow-lg p-6">
            <form
              className="flex flex-col items-center gap-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex flex-col w-full">
                <label
                  htmlFor="name"
                  className="text-cyan-700 font-semibold mb-1"
                >
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-md text-[1rem] p-1 bg-white"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label
                  htmlFor="age"
                  className="text-cyan-700 font-semibold mb-1"
                >
                  Age:
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min={0}
                  max={99}
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-md text-[1rem] p-1 bg-white"
                />
                {errors.age && (
                  <div className="text-red-500 text-sm">{errors.age}</div>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label
                  htmlFor="role"
                  className="text-cyan-700 font-semibold mb-1"
                >
                  Role:
                </label>
                <select
                  id="role"
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="rounded-md text-[1rem] p-1 bg-white"
                >
                  <option value="Member">Member</option>
                  <option value="Lead">Lead</option>
                  <option value="Manager">Manager</option>
                </select>
                {errors.role && (
                  <div className="text-red-500">{errors.role}</div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  className="w-20 bg-cyan-700 text-lime-200 rounded-md mt-4 py-1"
                  type="submit"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={cancelHandler}
                  className="w-20 bg-cyan-700 text-lime-200 rounded-md mt-4 py-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full px-10 mt-6 flex justify-between">
        <h3 className="text-[2rem] font-bold text-cyan-700">All Users</h3>
        <button
          onClick={() => setIsOpen(true)}
          className="w-fit py-1 px-2 rounded-md bg-green-400"
        >
          Add User
        </button>
      </div>

      <div className="w-full flex justify-between px-10 mt-4">
        <div className="w-[30%] rounded-sm">
          <input
            type="text"
            id="search"
            placeholder="Search by name..."
            name="search"
            value={search}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-sm bg-white text-[1rem] px-2 py-1"
          />
        </div>
        <select
          className="w-[25%] bg-white p-1 rounded-sm"
          defaultValue={"DEFAULT"}
          onChange={(e) => setSortType(e.target.value)}
        >
          <option value="DEFAULT" disabled>
            Sort by
          </option>
          <option value="name">Name</option>
          <option value="age">Age</option>
        </select>
      </div>

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
        {data.map((user, index) => (
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
                onClick={() => deletehandler(index)}
              >
                Delete
              </button>
              <button
                className="w-fit py-1 px-2 rounded-md bg-green-400"
                onClick={() => editHandler(user)}
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
