import React, { useState } from "react";
import { useFormik } from "formik";

const User = ({ onAddUser, userToEdit }) => {
  console.log(userToEdit)
  const initialValues = userToEdit || {
    name: "",
    age: "",
    role: "member",
  };

  const validate = (values) => {
    let errors = {};

    if (!values.name) {
      errors.name = "Required";
    }

    if (!values.age) {
      errors.age = "Required";
    } else if (values.age < 0 || values.age > 120) {
      errors.age = "Invalid Age";
    }

    if (!values.role) {
      errors.role = "Required";
    }

    return errors;
  };

  const onSubmit = (values, { resetForm }) => {
    const timestamp = new Date().toISOString();

    const newUser = {
      ...values,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    console.log("form data", newUser);
    onAddUser(newUser);
    resetForm();
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
    enableReinitialize: true,
  });

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
            required
            className="rounded-md text-[1rem] p-1 bg-white"
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          )}
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="age" className="text-cyan-700 font-semibold mb-1">
            Age:
          </label>
          <input
            type="text"
            id="age"
            name="age"
            value={formik.values.age}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            className="rounded-md text-[1rem] p-1 bg-white"
          />
          {formik.touched.age && formik.errors.age && (
            <div className="text-red-500 text-sm">{formik.errors.age}</div>
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
          {formik.errors.role ? (
            <div className="text-red-500">{formik.errors.role}</div>
          ) : null}
        </div>

        <div className="flex gap-4">
        <button
          className="w-20 bg-cyan-700 text-lime-200 rounded-md mt-4 py-1"
          type="submit"
        >
          Submit
        </button>
        {
          userToEdit ? <button className="w-20 bg-cyan-700 text-lime-200 rounded-md mt-4 py-1">Cancel</button> : null
        }
        </div>
      </form>
    </div>
  );
};

export default User;
