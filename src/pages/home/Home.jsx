import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import Loader from "../../components/Loader";
import Card from "../../components/Card";
import { Link } from "react-router";
import {
  FaGraduationCap,
  FaHeart,
  FaLightbulb,
  FaShieldAlt,
  FaAward,
  FaBookmark,
  FaArrowCircleRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  const axios = useAxios();
  const { data: homeData = {}, isLoading } = useQuery({
    queryKey: ["home-data"],
    queryFn: async () => {
      const res = await axios.get("/home-dynamic-data");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;

  const {
    featuredLessons = [],
    topContributors = [],
    mostSavedLessons = [],
  } = homeData;

  const benefits = [
    {
      id: 1,
      icon: <FaLightbulb className="text-3xl text-yellow-500" />,
      title: "Practical Wisdom",
      desc: "Books teach you theories, but life experiences give you raw, unedited practical knowledge.",
    },
    {
      id: 2,
      icon: <FaShieldAlt className="text-3xl text-green-500" />,
      title: "Avoid Mistakes",
      desc: "Learning from other people's failures helps you bypass costly mistakes in your own journey.",
    },
    {
      id: 3,
      icon: <FaHeart className="text-3xl text-red-500" />,
      title: "Emotional Growth",
      desc: "Real stories build deep empathy, mental resilience, and emotional intelligence.",
    },
    {
      id: 4,
      icon: <FaGraduationCap className="text-3xl text-blue-500" />,
      title: "Accelerated Success",
      desc: "Compress decades of someone else's life lessons into a 5-minute insightful read.",
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* swiper slide  */}
      <div className="w-full h-100 md:h-125 rounded-2xl overflow-hidden shadow-md">
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="h-full"
        >
          <SwiperSlide className="relative flex items-center justify-center bg-linear-to-r from-gray-900 to-blue-900 text-white p-8 md:p-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="badge badge-primary uppercase font-bold tracking-wider">
                Wisdom
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Turn Living into Learning
              </h2>
              <p className="text-sm md:text-base text-gray-300">
                Don't just pass through life. Document your regrets, celebrate
                your breakthroughs, and read raw insights shared by real people
                around the globe.
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide className="relative flex items-center justify-center bg-linear-to-r from-gray-900 to-purple-900 text-white p-8 md:p-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="badge badge-secondary uppercase font-bold tracking-wider">
                Community
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Learn From Real Human Mistakes
              </h2>
              <p className="text-sm md:text-base text-gray-300">
                The cheapest way to learn is from others' failures. Read
                curated, unfiltered journals of career missteps, personal growth
                milestones, and mindset shifts.
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide className="relative flex items-center justify-center bg-linear-to-r from-gray-900 to-emerald-900 text-white p-8 md:p-16">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <span className="badge badge-accent uppercase font-bold tracking-wider">
                Share
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Your Reflection Could Save a Life
              </h2>
              <p className="text-sm md:text-base text-gray-300">
                Got a life lesson you wish you knew 5 years ago? Become an
                educator of life. Share your core reflections today and inspire
                the community.
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* featured  */}
      <div className="px-4">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-3xl font-bold mb-2">Featured Life Lessons</h2>
          <p className="text-accent">
            Handpicked by our administrators for their profound depth and
            impact.
          </p>
        </div>

        {featuredLessons.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            No featured lessons at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLessons.map((lesson) => (
              <Card key={lesson._id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>

      {/* static card  */}
      <div className="py-16 px-6 md:px-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Why Learning From Life Matters
          </h2>
          <p className="text-accent">
            Understanding academic theories is great, but navigating life
            requires a different kind of curriculum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="card border border-base-300 p-6 space-y-4 hover:shadow-md transition-all"
            >
              <div className="w-fit p-3 bg-base-200 rounded-xl">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-bold">{benefit.title}</h3>
              <p className="text-accent">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* most saved  */}
      <div className="px-4">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-1">
              <FaBookmark />{" "}
              <span className="text-xs font-bold uppercase tracking-wider">
                Trending
              </span>
            </div>
            <h2 className="text-3xl md:text-3xl font-bold tracking-tight">
              Most Saved Lessons
            </h2>
          </div>
          <Link
            to="/public-lessons"
            className="text-sm font-semibold text-primary link link-hover"
          >
            View All
          </Link>
        </div>

        {mostSavedLessons.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            No trending lessons found.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mostSavedLessons.map((lesson) => (
              <Card key={lesson._id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="flex justify-center text-yellow-500 mb-1">
            <FaAward className="text-2xl" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Top Contributors of the Week
          </h2>
          <p className="text-accent">
            Meet the life educators who shared the most highly-rated wisdom this
            week.
          </p>
        </div>

        {topContributors.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            No contributors found.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {topContributors.map((author, index) => (
              <div
                key={index}
                className="flex flex-col items-center border border-base-300 p-6 rounded-2xl shadow-xs text-center"
              >
                <div className="avatar mb-4 relative">
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-base-100 shadow-xs">
                    {index + 1}
                  </div>
                  <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        author.authorPhoto ||
                        "https://plus.unsplash.com/premium_photo-1738590017220-5820f49608cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGRlbW8lMjB1c2VyfGVufDB8fDB8fHww"
                      }
                      alt={author.authorName}
                    />
                  </div>
                </div>
                <h4 className="font-bold text-sm md:text-base  truncate w-full">
                  {author.authorName}
                </h4>
                <p className="text-xs text-accent mt-1">
                  {author.lessonCount} Lessons Shared
                </p>
                <Link
                  to={`/author-lessons/${author.authorId}`}
                  className="mt-3 btn btn-sm btn-primary text-black"
                >
                  All Lessons <FaArrowCircleRight />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
