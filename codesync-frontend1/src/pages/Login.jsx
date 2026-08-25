import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCode } from "react-icons/fa";
import { loginUser } from "../services/authservice";
function Login() {

    const [showPassword,setShowPassword]=useState(false);
    const navigate = useNavigate();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const data = await loginUser({
    email,
    password,
});

console.log("LOGIN RESPONSE:", data);

localStorage.setItem("token", data.token);

console.log("TOKEN SAVED:", localStorage.getItem("token"));

navigate("/dashboard");

    } catch (error) {
        console.error(error);
        alert("Invalid email or password");
    }
};

    return (

        <div className="min-h-screen bg-slate-950 flex justify-center items-center">

            <div className="w-full max-w-md bg-slate-900 rounded-2xl shadow-2xl p-8">

                <div className="flex flex-col items-center">

                    <div className="w-16 h-16 rounded-full bg-blue-600 flex justify-center items-center mb-4">

                        <FaCode className="text-white text-2xl"/>

                    </div>

                    <h1 className="text-3xl text-white font-bold">
                        CodeSync
                    </h1>

                    <p className="text-gray-400 mt-2 text-center">
                        Real-time Collaborative Code Editor
                    </p>

                </div>

                <form className="mt-8" onSubmit={handleLogin}>

                    <div>

                        <label className="text-gray-300">
                            Email
                        </label>

                        <input
                        type="email"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
                        />

                    </div>

                    <div className="mt-5">

                        <label className="text-gray-300">
                            Password
                        </label>

                        <div className="relative">

            <input
     type={showPassword ? "text" : "password"}
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500"
          />

                            <button
                            type="button"
                            onClick={()=>setShowPassword(!showPassword)}
                            className="absolute right-4 top-6 text-gray-400">

                                {
                                    showPassword
                                    ?
                                    <FaEyeSlash/>
                                    :
                                    <FaEye/>
                                }

                            </button>

                        </div>

                    </div>

                    <button
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 duration-300 text-white py-3 rounded-lg font-semibold">

                        Login

                    </button>

                </form>

                <p className="text-center text-gray-400 mt-6">

                    Don't have an account?

                    <Link
                    to="/register"
                    className="text-blue-500 ml-2">

                        Register

                    </Link>

                </p>

            </div>

        </div>

    )

}

export default Login;