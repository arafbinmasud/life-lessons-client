import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loader from "../../../components/Loader";
import Swal from "sweetalert2";
import { FaBookmark, FaEnvelope, FaFolder, FaUserEdit } from "react-icons/fa";
import Card from "../../../components/Card";
import useRole from "../../../hooks/useRole";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import ErrorState from "../../../components/ErrorState";
import getErrorMessage from "../../../utils/errorMessage";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading, updateUser } = useAuth();
  const { isPremiumUser } = useRole();

  const {
    data: profileData = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user-profile-info", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/user-profile-info?email=${user?.email}`,
      );
      return res.data;
    },
  });

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        displayName: user?.displayName,
        photoURL: user?.photoURL,
      });
    }
  }, [user, reset]);

  const handleUpdateProfile = async (data) => {
    try {
      await updateUser({
        displayName: data.displayName,
        photoURL: data.photoURL,
      });

      const res = await axiosSecure.patch(
        `/users/update-profile?email=${user?.email}`,
        {
          name: data.displayName,
          photo: data.photoURL,
        },
      );

      if (!res.data.modifiedCount) {
        Swal.fire("No Changes", "Your profile was already up to date.", "info");
        return;
      }

      Swal.fire(
        "Success!",
        "Profile updated successfully. Please Reload",
        "success",
      );
      refetch();
      document.getElementById("update_modal").close();
    } catch (err) {
      console.error("Failed to update profile", err);
      Swal.fire("Update Failed", getErrorMessage(err), "error");
    }
  };

  if (isLoading || loading) return <Loader />;

  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Failed to load your profile"
      />
    );
  }

  const {
    totalCreated = 0,
    totalSaved = 0,
    myPublicLessons = [],
  } = profileData;

  return (
    <div className="space-y-12 p-2 md:p-6">
      <div className="border border-base-300 rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* left side user info */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="avatar relative">
            <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
              <img
                src={
                  user?.photoURL ||
                  "https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbW8lMjB1c2VyfGVufDB8fDB8fHww"
                }
                alt="Profile"
              />
            </div>
            {isPremiumUser && (
              <span className="absolute bottom-0 right-0 badge badge-warning font-bold shadow-sm text-xs">
                Premium ⭐
              </span>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              {user?.displayName}
            </h2>
            <p className="text-accent flex items-center justify-center gap-2 mt-1">
              <FaEnvelope /> {user?.email}
            </p>
          </div>

          <button
            onClick={() => document.getElementById("update_modal").showModal()}
            className="btn btn-outline btn-xs gap-1"
            type="button"
          >
            <FaUserEdit /> Edit Profile
          </button>
        </div>

        {/* right side stats */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-center space-y-2">
            <div className="flex justify-center text-blue-500 text-xl">
              <FaFolder />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Lessons Created
            </p>
            <h3 className="text-3xl font-black text-blue-600">
              {totalCreated}
            </h3>
          </div>

          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 text-center space-y-2">
            <div className="flex justify-center text-orange-500 text-xl">
              <FaBookmark />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Lessons Saved
            </p>
            <h3 className="text-3xl font-black text-orange-600">
              {totalSaved}
            </h3>
          </div>
        </div>
      </div>

      {/* all public lessons */}
      <div className="space-y-6">
        <div className="pb-4">
          <h2 className="text-2xl font-bold tracking-tight">
            My Public Contributions
          </h2>
          <p className="text-accent mt-2">
            All of your life lessons shared with the world, sorted by newest
            first.
          </p>
        </div>

        {myPublicLessons.length === 0 ? (
          <div className="text-center py-12 text-accent">
            You haven't published any public lessons yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {myPublicLessons.map((lesson) => (
              <Card key={lesson._id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>

      <dialog id="update_modal" className="modal">
        <div className="modal-box w-full max-w-xl">
          <h3 className="font-bold text-xl mb-4">Update Profile</h3>

          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <fieldset className="fieldset space-y-3">
              <div>
                <label className="label font-bold mb-1 text-sm">
                  Author Name
                </label>
                <input
                  {...register("displayName", { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label font-bold mb-1 text-sm">
                  Author Photo URL
                </label>
                <input
                  {...register("photoURL", { required: true })}
                  type="text"
                  className="input input-bordered w-full"
                />
              </div>
            </fieldset>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                onClick={() => {
                  reset();
                  document.getElementById("update_modal").close();
                }}
                className="btn"
                type="button"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Profile;
