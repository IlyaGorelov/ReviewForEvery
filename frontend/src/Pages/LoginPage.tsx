import React from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../Context/useAuth";
import { useForm } from "react-hook-form";

type Props = {};

type LoginFormsInput = {
  email: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  password: Yup.string()
    .matches(/[A-Z]/, "There must be at least one capital letter")
    .matches(/[0-9]/, "There must be at least one digit.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Add special symbol")
    .required("Password is required"),
});

const LoginPage = (props: Props) => {
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInput>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInput) => {
    loginUser(form.email, form.password);
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            {...register("email")}
          />
          {errors.email ? <p>{errors.email.message}</p> : ""}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            {...register("password")}
          />
          {errors.password ? <p>{errors.password.message}</p> : ""}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
