import React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {SignInWithGoogle} from "../common/firebase.jsx"
import InputBox from "../components/input.component.jsx";
import { FaUser } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";
import { MdAlternateEmail } from "react-icons/md";
import googleIcon from "../imgs/google.png";
import { AnimationWraper } from "../common/page-animation.jsx";

export default function UserAuthForm({ type }) {
  const formRef = React.useRef(null);
  const navigate = useNavigate();

  const {
    mutate: CreateAccountOrLogin,
    isPending: Connecting,
  } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/${type}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Login failed");
        }

        const data = await res.json();
        return data;
      } catch (e) {
        toast.error(e.message);
        throw e;
      }
    },
    onSuccess: () => {
      toast.success(
        type === "signin" ? "Logged in successfully" : "Account created successfully"
      );
    //  window.location.href = "/";
    },
  });

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!formRef.current) return;

    const form = new FormData(formRef.current);
    const newForm = {};
    for (let [key, value] of form.entries()) {
      newForm[key] = value;
    }

    CreateAccountOrLogin(newForm);
  }

  return (
    <AnimationWraper keyValue={type}>
      <div className="w-full flex flex-col gap-2.5 justify-center items-center h-[75vh]">
        <h3 className="font-bold text-2xl">
          {type === "signin" ? "Welcome back!" : "Join us today!"}
        </h3>

        <form ref={formRef} onSubmit={handleFormSubmit}>
          {type === "signup" && (
            <InputBox
              type="text"
              placeholder="Full name"
              id="fullname"
              name="fullname"
              Icon={FaUser}
              color="gray"
            />
          )}

          <InputBox
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            Icon={MdAlternateEmail}
            color="gray"
          />

          <InputBox
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            Icon={TbPassword}
            color="gray"
          />

          <div className="w-full flex gap-3 flex-col justify-center items-center mt-4">
            <button
              className="bg-black text-white font-bold p-2 rounded-lg w-[80px]"
              type="submit"
            >
              {Connecting
                ? type === "signin"
                  ? "Signing in..."
                  : "Signing up..."
                : type}
            </button>

            <div className="flex gap-2 items-center w-full">
              <hr className="border w-1/2 border-gray-300" />
              <p className="text-gray-400">or</p>
              <hr className="border w-1/2 border-gray-300" />
            </div>

            <div onClick={SignInWithGoogle} className="btn-dark w-full flex items-center gap-3 justify-center font-bold">
              <img src={googleIcon} className="w-5" alt="Google" />
              <p className="text-gray-100">Continue with Google</p>
            </div>

            {type === "signup" ? (
              <p>
                Already a member?{" "}
                <Link className="underline" to="/signin">
                  Login
                </Link>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <Link className="underline" to="/signup">
                  Create
                </Link>
              </p>
            )}
          </div>
        </form>
      </div>
    </AnimationWraper>
  );
}
