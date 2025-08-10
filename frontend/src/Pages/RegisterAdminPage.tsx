import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../Context/useAuth";
import { useForm } from "react-hook-form";
import { registerAdminAPI } from "../Services/AuthService";

type Props = {};

type RegisterFormsInput = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .matches(/[A-Z]/, "There must be at least one capital letter")
    .matches(/[0-9]/, "There must be at least one digit.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Add special symbol")
    .required("Password is required"),
});

const RegisterAdminPage = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInput>({ resolver: yupResolver(validation) });

  const handleLogin = (form: RegisterFormsInput) => {
    registerAdminAPI(form.userName,form.email, form.password)
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Sign up</h2>
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm">User name</label>
          <input
            className="w-full border rounded px-3 py-2"
            {...register("userName")}
          />
          {errors.userName && (
            <p className="text-red-500 text-sm">{errors.userName.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Sign up
        </button>
      </form>
    </div>
  );
};

export default RegisterAdminPage;
