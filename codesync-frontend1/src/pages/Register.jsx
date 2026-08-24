import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCode, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {

            setLoading(true);

            await registerUser({
                username: form.username,
                email: form.email,
                password: form.password
            });

            alert("User Registered Successfully");

            navigate("/");

        } catch (error) {

            console.error("Registration error:", error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-10">

            {/* Logo */}

            <div className="flex flex-col items-center mb-8">

                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">

                    <FaCode className="text-white text-2xl" />

                </div>

                <h1 className="text-4xl font-bold text-white">
                    CodeSync
                </h1>

                <p className="text-slate-400 mt-2 text-lg">
                    Real-time Collaborative Code Editor
                </p>

            </div>


            {/* Register Card */}

            <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-8 shadow-2xl">

                <div className="text-center mb-8">

                    <h2 className="text-3xl font-bold text-white">
                        Create Account
                    </h2>

                    <p className="text-slate-400 mt-2">
                        Join CodeSync and start collaborating
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Username */}

                    <div>

                        <label className="block text-white mb-2">
                            Username
                        </label>

                        <div className="relative">

                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                    </div>


                    {/* Email */}

                    <div>

                        <label className="block text-white mb-2">
                            Email
                        </label>

                        <div className="relative">

                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                    </div>


                    {/* Password */}

                    <div>

                        <label className="block text-white mb-2">
                            Password
                        </label>

                        <div className="relative">

                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-4 pl-12 pr-12 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }
                            </button>

                        </div>

                    </div>


                    {/* Confirm Password */}

                    <div>

                        <label className="block text-white mb-2">
                            Confirm Password
                        </label>

                        <div className="relative">

                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                required
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-4 pl-12 pr-12 text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showConfirmPassword
                                    ? <FaEyeSlash />
                                    : <FaEye />
                                }
                            </button>

                        </div>

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-4 rounded-lg transition duration-200 mt-3"
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>

                </form>


                {/* Divider */}

                <div className="flex items-center gap-4 my-7">

                    <div className="flex-1 h-px bg-slate-700"></div>

                    <span className="text-slate-500">
                        or
                    </span>

                    <div className="flex-1 h-px bg-slate-700"></div>

                </div>


                {/* Login */}

                <p className="text-center text-slate-400">

                    Already have an account?

                    <button
                        onClick={() => navigate("/")}
                        className="text-blue-500 hover:text-blue-400 ml-2 font-medium"
                    >
                        Login
                    </button>

                </p>

            </div>

        </div>
    );
}

export default Register;