import { Link, useSearchParams } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { FaCheckCircle } from "react-icons/fa";
import getErrorMessage from "../../utils/errorMessage";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    if (user?.email && sessionId) {
      axiosSecure
        .patch(`/users/upgrade/${user.email}`, { sessionId })
        .then((res) => {
          if (res.data.modifiedCount > 0) {
            Swal.fire({
              title: "Congratulations!",
              text: "You are now a Premium Member.",
              icon: "success",
            });
          }
        })
        .catch((err) => {
          console.error("Failed to activate premium membership", err);
          Swal.fire({
            title: "Activation Failed",
            text: `Your payment succeeded but we could not activate premium access: ${getErrorMessage(err)}`,
            icon: "error",
          });
        });
    }
  }, [user, sessionId, axiosSecure]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-green-100">
        <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-secondary mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          Thank you for upgrading. Your lifetime access is now active.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="btn btn-primary text-black px-10 rounded-full"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
