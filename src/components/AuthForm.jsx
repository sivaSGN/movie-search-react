// ============================================
// src/components/AuthForm.jsx
// A single form that toggles between "Login" and "Register" modes.
// It doesn't talk to the backend directly — it just collects input
// and calls the onLogin/onRegister functions passed down from App.jsx.
// Keeping the actual fetch logic in App.jsx means App stays the one
// place that owns "who is logged in" — this component just collects input.
// ============================================

import { useState } from "react";

function AuthForm({ mode, setMode, onLogin, onRegister, authError, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin(email, password);
    } else {
      onRegister(name, email, password);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal auth-modal">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        <h2 className="auth-title">{isLogin ? "Log In" : "Create Account"}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {authError && <p className="auth-error">{authError}</p>}

          <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthForm;