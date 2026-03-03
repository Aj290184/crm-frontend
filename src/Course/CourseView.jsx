import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function CourseView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await callApi(`/courses/${id}`, "GET");
        setCourse(res?.data);
      } catch (err) {
        console.error("Fetch course error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Course not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header userName="Course Details" />

        <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
          <div className="max-w-5xl mx-auto space-y-6">

            <button onClick={() => navigate(-1)}
              className="text-sm text-cyan-600 hover:underline">
              ← Back
            </button>

            {/* Card */}
            <div className="border border-gray-200 rounded-2xl shadow-sm p-5 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {course.courseImg && (
                  <div className="flex justify-center md:justify-start">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <img src={course.courseImg}
                        alt={course.courseName}
                        className="w-48 rounded-3xl md:w-56 h-32 object-contain md:rounded-3xl"/>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 space-y-4 text-center md:text-left">

                  {/* Level Badge */}
                  <span className="inline-block text-xs px-3 py-1 rounded-full border border-cyan-200 text-cyan-600 font-medium">
                    {course.level}
                  </span>

                  {/* Title */}
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {course.courseName}
                  </h1>

                  {/* Description */}
                  <p className="text-sm text-gray-600">
                    {course.description || "No description available"}
                  </p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-3">

                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-500 text-xs">Duration</span>
                      <p className="font-medium text-gray-800">
                        {course.duration}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-500 text-xs">Fee</span>
                      <p className="font-medium text-gray-800">
                        ₹ {course.fee}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-500 text-xs">Mode</span>
                      <p className="font-medium text-gray-800">
                        {course.mode}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3">
                      <span className="text-gray-500 text-xs">Status</span>
                      <p className={`font-medium ${
                          course.status === "Inactive"
                            ? "text-red-500"
                            : "text-green-600"}`}>
                        {course.status || "Active"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <button
                      onClick={() => navigate(`/courses/edit/${course._id}`)}
                      className="px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition w-full sm:w-auto">
                      Edit Course
                    </button>

                    <button onClick={() => navigate("/courses")}
                      className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition w-full sm:w-auto">
                      Back to Courses
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}