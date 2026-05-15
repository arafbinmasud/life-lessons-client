import { FaArrowLeft, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router";

const PaymentCancel = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-red-100 max-w-md">
        <FaTimesCircle className="text-8xl text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-secondary mb-2">
          Payment Cancelled
        </h1>
        <p className="text-accent my-5 text-lg">
          It looks like you cancelled the payment process. No worries, your
          account status remains unchanged.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            to="/upgrade-plan"
            className="btn btn-primary text-black px-10 rounded-full font-bold"
          >
            Try Again
          </Link>

          <Link
            to="/"
            className="btn btn-ghost text-gray-500 flex items-center justify-center gap-2"
          >
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
