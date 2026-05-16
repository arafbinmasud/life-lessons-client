import {
  FaHeart,
  FaBookmark,
  FaFlag,
  FaArrowCircleRight,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from "react-share";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";

const LessonDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axios = useAxios();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // main data fetch
  const {
    data: lesson,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["lesson", id],
    staleTime: 0,
    queryFn: async () => {
      const res = await axios.get(`/lessons/${id}`);
      return res.data;
    },
  });

  // comments fetch
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${id}`);
      return res.data;
    },
  });

  // similar data fetch
  const { data: similarLessons = [], isLoading: isSimilarLoading } = useQuery({
    queryKey: ["similar-lessons", lesson?.category, id, lesson?.tone],
    enabled: !!lesson?.category,
    queryFn: async () => {
      const res = await axios.get(
        `/lessons/similar?category=${lesson.category}&tone=${lesson.tone}&id=${id}`,
      );
      return res.data;
    },
  });

  const handleLike = async () => {
    if (!user) return navigate("/authentication/login");
    await axiosSecure.patch(`/lessons/like/${id}`, { email: user.email });
    refetch();
  };

  const handleFavorites = async () => {
    if (!user) {
      return navigate("/authentication/login");
    }
    await axiosSecure.patch(`lessons/favorites/${id}`, {
      email: user.email,
    });
    refetch();
  };

  const handleReport = async () => {
    const { value: reason } = await Swal.fire({
      title: "Report this Lesson",
      text: "Are you sure you want to report this? Please tell us why:",
      icon: "warning",
      input: "select",
      inputOptions: {
        inappropriateContent: "Inappropriate Content",
        hateSpeechOrHarassment: "Hate Speech or Harassment",
        misleadingOrFalseInformation: "Misleading or False Information",
        spamOrPromotionalContent: "Spam or Promotional Content",
        sensitiveOrDisturbingContent: "Sensitive or Disturbing Content",
        other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
      confirmButtonText: "Submit Report",
      confirmButtonColor: "#d33",
      cancelButtonText: "Cancel",
    });

    if (reason) {
      const reportData = {
        lessonId: lesson?._id,
        reporterUserId: user?.uid,
        reporterUserEmail: user?.email,
        reason: reason,
        timestamp: new Date(),
      };

      const res = await axiosSecure.post("/lesson-report", reportData);

      if (res.data.insertedId) {
        Swal.fire(
          "Reported!",
          "Thank you. This lesson has been reported to the admin.",
          "success",
        );
      }
      if (res.data.message) {
        Swal.fire({
          title: "Oops...",
          text: res.data.message,
          icon: "warning",
        });
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentText = e.target.comment.value;
    if (!commentText.trim()) return;

    const newComment = {
      lessonId: id,
      userName: user?.displayName,
      userImage:
        user?.photoURL ||
        "https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbW8lMjB1c2VyfGVufDB8fDB8fHww",
      text: commentText,
      createdAt: new Date(),
    };

    const res = await axiosSecure.post("/comments", newComment);
    if (res.data.insertedId) {
      e.target.reset();
      refetchComments();
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      {/* main grid  */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* main side left- full details n cmnts like, save, report , share etc*/}
        <div className="lg:col-span-2">
          {lesson?.image && (
            <img
              src={lesson.image}
              className="w-full max-h-96 object-cover rounded-2xl mb-6 shadow-lg"
              alt=""
            />
          )}
          <div className="flex gap-2 mb-4">
            <span className="badge badge-outline">{lesson?.category}</span>
            <span className="badge badge-secondary">{lesson?.tone}</span>
          </div>
          <h1 className="text-4xl font-bold mb-6">{lesson?.title}</h1>
          <p className="leading-relaxed text-lg">{lesson?.description}</p>

          {/* btns and share  */}
          <div className="flex flex-col md:flex-row gap-4 mt-10 border-y py-4">
            {/* btns  */}
            <div>
              <button
                onClick={handleLike}
                className={`btn btn-outline ${lesson?.likes?.includes(user?.email) ? "btn-secondary" : ""}`}
              >
                <FaHeart /> {lesson?.likes?.length || 0}{" "}
                {lesson?.likes?.length > 1 ? "Likes" : "Like"}
              </button>
              <button
                onClick={handleFavorites}
                className={`btn mx-5 btn-outline ${lesson?.favorites?.includes(user?.email) ? "btn-secondary" : ""}`}
              >
                <FaBookmark /> {lesson?.favorites?.length || 0}{" "}
                {lesson?.favorites?.length > 1 ? "Favorites" : "Favorite"}
              </button>
              <button
                onClick={handleReport}
                className="btn btn-outline btn-ghost text-red-500"
              >
                <FaFlag /> Report
              </button>
            </div>

            {/* share  */}
            <div className="flex w-full md:w-fit gap-2 items-center ml-auto">
              <p className="font-bold">Share:</p>
              <FacebookShareButton url={window.location.href}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={window.location.href}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
            </div>
          </div>

          {/* comments  */}
          <div className="mt-12 pt-8">
            <h3 className="text-2xl font-bold mb-6">
              Comments ({comments.length})
            </h3>
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div>
                <textarea
                  name="comment"
                  className="textarea textarea-bordered h-24 w-full focus:outline-none"
                  placeholder="Share your thoughts about this lesson..."
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-secondary btn-sm mt-3">
                Post Comment
              </button>
            </form>

            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-gray-400 italic">
                  No comments yet. Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex gap-3 p-4 rounded-xl border border-base-300 shadow-sm"
                  >
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <img src={comment.userImage} alt={comment.userName} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">
                          {comment.userName}
                        </h4>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1 text-sm p-2 rounded-lg wrap-break-word">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* lesson info and author info (right side div of grid)  */}
        <div className="space-y-6">
          {/* lesson info  */}
          <div className="bg-base-200 p-6 rounded-2xl">
            <h3 className="font-bold mb-2">Lesson Info</h3>
            <p className="text-sm">
              Created At:{" "}
              {new Date(lesson?.createdAt).toLocaleDateString("en-Gb", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            {lesson?.updatedAt && (
              <p className="text-sm">
                Last Update:{" "}
                {new Date(lesson?.updatedAt).toLocaleDateString("en-Gb", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            )}
            <p className="text-sm">Visibility: {lesson?.privacy}</p>
          </div>
          {/* author info  */}
          <div className="card bg-white shadow-xl border border-base-300">
            <div className="card-body items-center text-center">
              <div className="avatar">
                <div className="w-20 rounded-full ring ring-secondary ring-offset-base-100 ring-offset-2">
                  <img
                    src={
                      lesson?.authorPhoto ||
                      "https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbW8lMjB1c2VyfGVufDB8fDB8fHww"
                    }
                    alt=""
                  />
                </div>
              </div>
              <h2 className="card-title mt-2">{lesson?.authorName}</h2>
              <p className="text-sm text-accent">(Author)</p>
              <p className="text-sm">Total Lessons: {lesson?.totalLessons} </p>
              <Link
                to={`/author-lessons/${lesson?.authorId}`}
                className="btn btn-sm btn-secondary mt-4 w-full"
              >
                View All Lessons
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* similar lessons div outside of grid box*/}
      {isSimilarLoading && <Loader />}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8">
          Similar Lessons You Might Like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {similarLessons.map((item) => (
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
                  <span className="badge badge-secondary badge-outline">
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
                    Read Lesson <FaArrowCircleRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonDetails;
