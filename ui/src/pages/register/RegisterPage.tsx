import { useState, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router";
import { MinimalHeader } from "@/components/header/MinimalHeader";
import { API_ENDPOINTS, apiRequest } from "@/utils";
import { useSetUser } from "@/hooks/useUser";
import type { User } from "@/types";
import { verifyLogin } from "@/utils/authentication";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setUser = useSetUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const resp = await apiRequest<User>({
      endpoint: API_ENDPOINTS.auth.register.POST,
      method: "post",
      payload: { email, password },
    });

    if (resp.success && resp.data) {
      const userData = await verifyLogin();

      if (userData) {
        setUser(userData);
        navigate("/", { replace: true });
      } else {
        setMessage(
          "Registration successful. Before logging in, please enable third-party cookies to continue. Or open the app in a Guest window.",
        );
      }
    } else {
      setError(resp.message || "Unable to register");
    }
  };

  return (
    <>
      {/* head */}
      <title>Register - Shop</title>

      {/* body */}
      <MinimalHeader />
      <div className="flex justify-center items-center h-screen pt-15">
        <form className="w-80 flex flex-col gap-4 bg-white p-8 rounded shadow" onSubmit={onSubmit}>
          <h2 className="m-0 mb-2 text-2xl font-bold text-gray-800">Create account</h2>
          {error && <div className="text-red-700 text-sm text-center">{error}</div>}
          {message && <div className="text-[#2e7d32] text-sm text-center">{message}</div>}
          <label className="flex flex-col text-sm text-gray-600 font-medium">
            Email
            <input
              className="p-2.5 text-base mt-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent outline-none transition-all duration-200"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </label>
          <button 
            className="p-3 mt-2 bg-[#2e7d32] text-white font-semibold border-none rounded cursor-pointer text-base shadow-md hover:bg-[#1b5e20] hover:shadow-lg active:scale-[0.98] transition-all duration-200"
            type="submit"
          >
            Register
          </button>
          <p className="text-sm text-gray-600 text-center mt-2">
            Already have an account? <NavLink to="/login" className="text-[#2e7d32] font-semibold hover:underline">Login</NavLink>
          </p>
        </form>
      </div>
    </>
  );
}
