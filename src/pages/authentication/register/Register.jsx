import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Social from "../social/Social";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const { registerUser, updateUser } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = (data) => {
    // to save in db
    const user = {
      displayName: data.name,
      email: data.email,
      photoURL: data.photo,
      role: "user",
      isPremiumUser: false,
    };

    const updateInfo = {
      displayName: data.name,
      photoURL: data.photo,
    };
    registerUser(data.email, data.password)
      .then((res) => {
        const token = res.user.accessToken;
        updateUser(updateInfo);
        navigate("/");
        axios
          .post("/users", user, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            if (res.data.insertedId || res.data.message === "User Exists") {
              toast.success(`Hi ${data.name}, Welcome to Digital Life Lessons`);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="hero min-h-screen ">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Join our community to preserve your wisdom and learn from the
            journeys of others.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(handleRegister)}>
              <fieldset className="fieldset">
                {/* Name  */}
                <label className="label">Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  className="input"
                  placeholder="Your Name"
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-500">Name is Required</p>
                )}

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

                {/* PhotoURL  */}
                <label className="label">PhotoURL</label>
                <input
                  {...register("photo")}
                  type="text"
                  className="input"
                  placeholder="Your PhotoURL"
                />

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

                <button className="btn btn-neutral mt-4">Register</button>
              </fieldset>
            </form>
            <p className="text-center">OR</p>
            <Social />
            <p>
              Already a User?{" "}
              <Link
                to="/authentication/login"
                className="text-blue-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
