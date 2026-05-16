import { FaArrowCircleRight, FaLock } from "react-icons/fa";
import useRole from "../hooks/useRole";
import Loader from "./Loader";
import { Link } from "react-router";

const Card = ({ lesson }) => {
  const { isPremiumUser, loading } = useRole();
  const isLocked = lesson.accessLevel === "Premium" && !isPremiumUser;
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="card shadow-xl border border-base-300 overflow-hidden relative">
      {isLocked && (
        <div className="absolute inset-0 z-2 backdrop-blur-sm flex flex-col items-center justify-center text-center">
          <FaLock className="text-4xl mb-2" />
          <p className="font-bold">Premium Lesson</p>
          <Link to="/upgrade-plan" className="btn btn-xs btn-warning mt-2">
            Upgrade to view
          </Link>
        </div>
      )}

      <div className="h-65">
        {lesson.image ? (
          <img
            src={lesson.image}
            alt={lesson.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      <div className="card-body">
        <div className=" flex gap-2 flex-wrap">
          <span className="badge badge-error badge-outline">
            {lesson.category}
          </span>
          <span className="badge badge-secondary badge-outline">
            {lesson.tone}
          </span>
        </div>
        <p className="text-accent">
          Posted At:{" "}
          {new Date(lesson.createdAt).toLocaleString("en-Gb", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
        <h3 className="card-title mt-2">{lesson.title}</h3>
        <p className="text-accent text-sm line-clamp-3">{lesson.description}</p>
        <div className="flex gap-3 items-center mt-5">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full ring ring-secondary ring-offset-2 ring-offset-base-100">
              <img
                src={
                  lesson.authorPhoto ||
                  "https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbW8lMjB1c2VyfGVufDB8fDB8fHww"
                }
              />
            </div>
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm text-base-content">
              {lesson.authorName}
            </p>
            <p className="text-xs text-gray-400">Author</p>
          </div>
        </div>
        <div className="card-actions justify-end mt-4">
          <Link
            to={`/lesson-details/${lesson._id}`}
            className="btn btn-sm btn-primary text-black"
          >
            See Details <FaArrowCircleRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
