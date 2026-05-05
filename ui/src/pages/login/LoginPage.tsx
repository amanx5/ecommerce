import { useState, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router";
import { MinimalHeader } from "@/components/header/MinimalHeader";
import { useLogin } from "@/hooks/user/useLogin";
import { toast } from "react-hot-toast";
import { Spinner } from "@/components/Spinner";

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const [email, setEmail] = useState("user@abc.com");
  const [password, setPassword] = useState("password");

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate("/", { replace: true });
        },
        onError: (err) => {
          const message = err.message || "Unable to sign in";
          toast.error(message, { duration: 8000 });
        },
      },
    );
  };

  return (
    <>
      <title>Login - Shop</title>
      <MinimalHeader />
      <div className="flex justify-center items-center h-screen pt-15">
        <form
          className="w-80 flex flex-col gap-4 bg-white p-8 rounded shadow"
          onSubmit={onSubmit}
        >
          <h2 className="m-0 mb-2 text-2xl font-bold text-gray-800">Login</h2>

          <label className="flex flex-col text-sm text-gray-600 font-medium">
            Email
            <input
              className="p-2.5 text-base mt-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent outline-none transition-all duration-200"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoggingIn}
              required
            />
          </label>
          <label className="flex flex-col text-sm text-gray-600 font-medium">
            Password
            <input
              className="p-2.5 text-base mt-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent outline-none transition-all duration-200"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoggingIn}
              required
            />
          </label>
          <button
            className="button-primary w-full h-11 mt-2 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            type="submit"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <Spinner size={18} color="inherit" /> : "Login"}
          </button>
          <p className="text-sm text-gray-600 text-center mt-2">
            {"Don't have an account? "}
            <NavLink
              to="/register"
              className="text-[#2e7d32] font-semibold hover:underline"
            >
              Register
            </NavLink>
          </p>
        </form>
      </div>
    </>
  );
}
