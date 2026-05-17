import { Link } from "react-router";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="relative flex justify-center">
          <h1 className="text-9xl font-black text-gray-200  select-none">
            404
          </h1>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content">
            Oops! Not Found
          </h2>
          <p className="text-accent text-sm md:text-base">
            The life lesson or page you are looking for doesn't exist
          </p>
        </div>

        <div>
          <Link to="/" className="btn btn-primary gap-2">
            <FaHome className="text-lg" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
