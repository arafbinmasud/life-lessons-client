import { useForm } from "react-hook-form";
import useRole from "../../../hooks/useRole";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useState } from "react";
import successAnimation from "../../../assets/Success.json";
import Lottie from "lottie-react";
import Loader from "../../../components/Loader";
import LessonFormFields from "../../../components/LessonFormFields";

const AddLesson = () => {
  const { isPremiumUser, loading } = useRole();
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  if (loading) {
    return <Loader />;
  }

  const handlePublishLesson = (data) => {
    data.isFeatured = false;
    data.likes = [];
    data.favorites = [];
    data.authorPhoto = user?.photoURL
    data.authorId = user?.uid

    axiosSecure
      .post("/lessons", data)
      .then((res) => {
        if (res.data.insertedId) {
          setShowSuccess(true);
          reset();

          setTimeout(() => {
            setShowSuccess(false);
          }, 4000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="relative">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl flex flex-col items-center">
            <Lottie.default
              animationData={successAnimation}
              loop={false}
              className="w-64 h-64"
            />
            <h2 className="text-2xl font-bold text-green-600 mt-4">
              Lesson Published!
            </h2>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold text-center mb-5">
        Share A Life Lesson
      </h1>
      <div className="card bg-base-100 w-full max-w-6xl mx-auto shrink-0 shadow-2xl">
        <div className="card-body">
          <form onSubmit={handleSubmit(handlePublishLesson)}>
            <fieldset className="fieldset">
              <LessonFormFields
                register={register}
                errors={errors}
                isPremiumUser={isPremiumUser}
                user={user}
              />

              <button className="btn btn-neutral mt-4">Publish Lesson</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLesson;
