import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Charts from "../components/Charts/Charts";

const Home = () => {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const logouthandler = async () => {
    try {
      await logOut();
      navigate("/");
      console.log(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="main__home">
      <nav>
        <div className="flex justify-between align-middle px-10 py-3 shadow-md">
          <h2 className="py-3 font-bold text-lg">{user ? `hey.. ${user.email}` : "Welcome"}</h2>
          <button
            onClick={logouthandler}
            className="w-auto px-5 text-center py-2  rounded bg-blue-500 text-white hover:bg-green-dark focus:outline-none my-1"
          >
            LogOut
          </button>
        </div>
      </nav>
      <section className="px-20 py-12 sm:px-10 md:px-8 bg-#ffffff ">
        <Charts />
      </section>
    </div>
  );
};

export default Home;
