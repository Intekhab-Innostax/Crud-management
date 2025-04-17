import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { addUser, editUser } from "../store/userSlice";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";

const User = ({setEditingIndex, userToEdit}) => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

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

  const onSubmit = async (values, { resetForm }) => {
    try {
      await UserSchema.validate(values, { abortEarly: false });
      console.log("form submit", values);
      const timestamp = new Date().toISOString();

      const newUser = {
        ...values,
        id: userToEdit ? userToEdit.id : uuidv4(),
        createdAt: timestamp,
        updatedAt: timestamp,
      };


      {
        userToEdit ? dispatch(editUser(newUser)) : dispatch(addUser(newUser));
      }
      setEditingIndex(null);
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

  const cancelHandler=()=> {
    setEditingIndex(null)
    toast.error("Cancel Edit")
  }

  return (
    <div className="w-full flex justify-center mt-8">
      <form
        className="w-[80%] bg-lime-200 flex flex-col items-center gap-4 p-6"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col w-full">
          <label htmlFor="name" className="text-cyan-700 font-semibold mb-1">
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
          <label htmlFor="age" className="text-cyan-700 font-semibold mb-1">
            Age:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            minLength={0}
            maxLength={2}
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
          <label htmlFor="role" className="text-cyan-700 font-semibold mb-1">
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
          {errors.role && <div className="text-red-500">{errors.role}</div>}
        </div>

        <div className="flex gap-4">
          <button
            className="w-20 bg-cyan-700 text-lime-200 rounded-md mt-4 py-1"
            type="submit"
          >
            Submit
          </button>
          {userToEdit ? (
            <button
              type="button"
              onClick={cancelHandler}
              className="w-20 bg-cyan-700 text-lime-200 rounded-md mt-4 py-1"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default User;
