import { FaCheck, FaStar, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useRole from "../../hooks/useRole";
import Swal from "sweetalert2";
import getErrorMessage from "../../utils/errorMessage";

const UpgradePlan = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { isPremiumUser, loading: roleLoading } = useRole();

  const handleUpgrade = async () => {
    try {
      const res = await axiosSecure.post("/payment-checkout-session", {
        price: 1500,
        userEmail: user?.email,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
        return;
      }
      Swal.fire(
        "Checkout Unavailable",
        "We could not start the checkout session. Please try again.",
        "warning",
      );
    } catch (err) {
      console.error("Failed to start checkout session", err);
      Swal.fire("Upgrade Failed", getErrorMessage(err), "error");
    }
  };

  if (roleLoading) return <Loader />;

 
  if (isPremiumUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-yellow-100 p-8 rounded-2xl shadow-lg border-2 border-yellow-400">
          <FaStar className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-800">You are a Premium Member!</h1>
          <p className="mt-2 text-gray-600">Enjoy your lifetime access to all exclusive features.</p>
         
        </div>
      </div>
    );
  }

  const features = [
    { name: "Daily Lesson Creation", free: "Up to 3", premium: "Unlimited" },
    { name: "Premium Lessons Access", free: false, premium: true },
    { name: "Create Paid Content", free: false, premium: true },
    { name: "Ad-Free Experience", free: false, premium: true },
    { name: "Priority Support", free: false, premium: true },
    { name: "Advanced Analytics", free: false, premium: true },
    { name: "Custom Profile Badge", free: false, premium: true },
    { name: "Export Lessons as PDF", free: false, premium: true },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Upgrade to Premium Plan</h1>
        <p className="text-accent max-w-xl mx-auto">
          Unlock the full potential of Digital Life Lessons and join our exclusive community of wisdom seekers.
        </p>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-2xl border border-base-300">
        <table className="table text-center">
          <thead>
            <tr className="bg-base-200 text-lg">
              <th className="text-left py-6 px-8">Features</th>
              <th>Free Plan</th>
              <th className="text-secondary font-bold">Premium Plan</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, i) => (
              <tr key={i}>
                <td className="text-left font-medium py-4 px-8">
                  {feature.name}
                </td>
                <td>
                  {typeof feature.free === "string" ? (
                    feature.free
                  ) : feature.free ? (
                    <FaCheck className="text-green-500 mx-auto" />
                  ) : (
                    <FaTimes className="text-red-400 mx-auto" />
                  )}
                </td>
                <td>
                  {typeof feature.premium === "string" ? (
                    feature.premium
                  ) : feature.premium ? (
                    <FaCheck className="text-secondary mx-auto" />
                  ) : (
                    <FaTimes className="text-red-400 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td className="py-8">
                <button disabled className="btn btn-disabled btn-outline">
                  Current Plan
                </button>
              </td>
              <td className="py-8">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl font-bold">৳1500 <span className="text-sm font-normal">/ Lifetime</span></span>
                  <button onClick={handleUpgrade} className="btn btn-primary text-black px-8">
                    Choose Premium Plan
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default UpgradePlan;