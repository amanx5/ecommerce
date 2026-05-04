import "./LoginPage.css";
import { useState, type SubmitEvent } from "react";
import { NavLink, useNavigate } from "react-router";
import { MinimalHeader } from "@/components/header/MinimalHeader";
import { API_ENDPOINTS, apiRequest } from "@/utils";
import { useSetUser } from "@/hooks/useUser";
import type { User } from "@/types";
import { verifyLogin } from "@/utils/authentication";

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useSetUser();
  const [email, setEmail] = useState("user@abc.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const resp = await apiRequest<User>({
      endpoint: API_ENDPOINTS.auth.signIn.POST,
      method: "post",
      payload: { email, password },
    });

    if (resp.success && resp.data) {
      const userData = await verifyLogin();

      if (userData) {
        setUser(userData);
        navigate("/", { replace: true });
      } else {
        setError(
          "Login failed. Please enable third-party cookies to continue. Or open the app in a Guest window.",
        );
      }
    } else {
      setError(resp.message || "Unable to sign in");
    }
  };

  return (
    <>
      <title>Login - Shop</title>
      <MinimalHeader />
      <div className="login-page">
        <form className="login-form" onSubmit={onSubmit}>
          <h2>Login</h2>
          {error && <div className="error">{error}</div>}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Login</button>
          <p>
            {"Don't have an account? "}
            <NavLink to="/register">Register</NavLink>
          </p>
        </form>
      </div>
    </>
  );
}
