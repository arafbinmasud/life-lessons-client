import { useState } from "react";
import useAxios from "../../hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { CATEGORY_OPTIONS, TONE_OPTIONS } from "../../constants";

const PublicLessons = () => {
  const axios = useAxios();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tone, setTone] = useState("");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data: { lessons = [], total = 0 } = {}, isLoading } = useQuery({
    queryKey: ["public-lessons", search, category, tone, sort, currentPage],
    queryFn: async () => {
      const res = await axios.get(
        `/public-lessons?search=${search}&category=${category}&tone=${tone}&sort=${sort}&page=${currentPage}&limit=${itemsPerPage}`,
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  if (isLoading) return <Loader />;

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8 text-center">
        Browse Life Lessons
      </h2>

      {/* search, filter, sort optns  */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <input
          type="text"
          value={search}
          placeholder="Search by title..."
          className="input input-bordered w-full"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={category}
          className="select select-bordered w-full"
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <select
          value={tone}
          className="select select-bordered w-full"
          onChange={(e) => {
            setTone(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Tones</option>
          {TONE_OPTIONS.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>
        <select
          value={sort}
          className="select select-bordered w-full"
          onChange={(e) => {
            setSort(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="newest">Newest First</option>
          <option value="most-saved">Most Saved</option>
        </select>
      </div>

      <p className="text-xl font-semibold text-center md:text-left my-5">
        Showing {lessons.length} of {total} Lessons
      </p>

      {/* main itms  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.length === 0 ? (
          <p className="text-accent italic col-span-full text-center py-10">
            No lessons found matching your criteria.
          </p>
        ) : (
          lessons.map((lesson) => <Card key={lesson._id} lesson={lesson} />)
        )}
      </div>

      {/* pagination btns  */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          
          <div className="join">
            <button
              className="join-item btn btn-sm md:btn-md"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaArrowLeft />
            </button>
            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`join-item btn ${currentPage === page + 1 ? "btn-primary" : ""}`}
              >
                {page + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="join-item btn btn-sm md:btn-md"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLessons;
