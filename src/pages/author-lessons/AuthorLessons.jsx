import { useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import ErrorState from "../../components/ErrorState";

const AuthorLessons = () => {
  const { authorId } = useParams();
  const axiosSecure = useAxiosSecure();

  const {
    data: authorLessons = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["author-lessons", authorId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/lessons/author/${authorId}`);
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <ErrorState
        error={error}
        onRetry={refetch}
        title="Failed to load author lessons"
      />
    );
  }

  if (authorLessons.length === 0) {
    return (
      <div className="text-center py-12 text-accent">
        This author has not shared any lessons yet.
      </div>
    );
  }

  return (
    <div>
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
        {authorLessons.map((lesson) => (
          <Card key={lesson._id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
};

export default AuthorLessons;
