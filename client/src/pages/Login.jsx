import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useUserAuth } from "../context/UserAuthContext";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();

  const formhandler = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/home");
      setEmail("");
      setPassword("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="bg-grey-lighter min-h-screen flex flex-col">
        <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
          {error && <div variant="danger">{error}</div>}
          <form onSubmit={formhandler} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
            <h1 className="mb-8 text-3xl text-center">Log In</h1>
            <input
              className="block border border-grey-light w-full p-3 rounded mb-4"
              type="email"
              placeholder="Email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="block border border-grey-light w-full p-3 rounded mb-4"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-green-dark focus:outline-none my-1"
              type="submit">
              Log In
            </button>
          </form>
          <div className="text-grey-dark mt-6">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
