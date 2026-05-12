import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Social from "../social/Social";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const { loginUser } = useAuth();
  const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (data) => {
    console.log("clicked", data);
    loginUser(data.email, data.password)
      .then((res) => {
        toast.success(`Login Successful! Welcome Back ${res.user.displayName}`);
        navigate("/")
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="hero bg-base-200 min-h-screen ">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Welcome back! Log in to continue your journey of sharing and
            learning life's wisdom.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(handleLogin)}>
              <fieldset className="fieldset">
                {/* Email  */}
                <label className="label">Email</label>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  className="input"
                  placeholder="Your Email"
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-500">Email is Required</p>
                )}

                {/* Password  */}
                <label className="label">Password</label>

                <div className="relative">
                  <input
                    {...register("password", {
                      required: true,
                      pattern: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                    })}
                    type={showPass ? "text" : "password"}
                    className="input"
                    placeholder="Your Password"
                  />
                  <button
                    className="absolute top-4 right-6 cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                    type="button"
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {errors.password?.type === "required" && (
                  <p className="text-red-500">Password is Required</p>
                )}
                {errors.password?.type === "pattern" && (
                  <p className="text-red-500">
                    Password must include at least one uppercase letter, one
                    lowercase letter, and be at least 6 characters long.
                  </p>
                )}

                <button className="btn btn-neutral mt-4">Login</button>
              </fieldset>
            </form>
            <p className="text-center">OR</p>
            <Social />
            <p>
              New User?{" "}
              <Link
                to="/authentication/register"
                className="text-blue-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
