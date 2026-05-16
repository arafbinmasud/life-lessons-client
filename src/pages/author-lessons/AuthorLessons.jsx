// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import useAxiosPublic from "../../../hooks/useAxiosPublic";
// import Loader from "../../../components/Loader";
// import { Link } from "react-router-dom";

import { Link, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import { FaArrowCircleRight } from "react-icons/fa";

const AuthorLessons = () => {
  const { authorId } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: authorLessons = [], isLoading } = useQuery({
    queryKey: ["author-lessons", authorId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/author/${authorId}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Lessons by this Author</h1>
        <p className="text-lg mt-2">
          Author Name: {authorLessons[0].authorName}
        </p>
        <p className="text-accent mt-2">
          Total Lessons Shared: {authorLessons.length}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authorLessons.map((item) => (
          <div key={item._id} className="card bg-base-100 shadow-xl">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="h-48 w-full object-cover rounded-t-2xl"
              />
            )}
            <div className="card-body">
              <div className=" flex gap-2 flex-wrap">
                           <span className="badge badge-error badge-outline">
                           {item.category}
                         </span>
                         <span className="badge badge-secondary badge-outline">
                           {item.tone}
                         </span>
                        </div>
              <h3 className="card-title mt-2">{item.title}</h3>
              <p className="text-accent text-sm line-clamp-3">
                {item.description}
              </p>
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/lesson-details/${item._id}`}
                  className="btn btn-sm btn-secondary"
                >
                  Read Lesson <FaArrowCircleRight/>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorLessons;
