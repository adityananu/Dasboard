import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useUserAuth } from "../context/UserAuthContext";

const SignUp = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signUp } = useUserAuth();

  const formhandler = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      navigate("/");
      setEmail("");
      setPassword("");
      console.log("created sucessfully");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
               {error && <div variant="danger">{error}</div>}
                <form  onSubmit={formhandler} className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
                    <h1 className="mb-8 text-3xl text-center">Sign up</h1>
                    <input 
                        onChange={(e) => setEmail(e.target.value)}
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        type="text"
                        name="email"
                        placeholder="Email" />

                    <input 
                        onChange={(e) => setPassword(e.target.value)}
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        type="password"
                        name="password"
                        placeholder="Password" />
                    <button
                        className="w-full text-center py-3 rounded bg-blue-500 text-white hover:bg-green-dark focus:outline-none my-1"
                        type="submit"
                    >Create Account</button>

                    <div className="text-center text-sm text-gray-500 mt-4">
                        By signing up, you agree to the Terms of Service and Privacy Policy
                    </div>
                </form>
                <div className="text-grey-dark mt-6">
                    Already have an account? 
                    <Link to="/">Log In</Link>
                </div>
            </div>
     </div>
  );
};

export default SignUp;
