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

        <main className="flex-1 px-6 py-8">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* BACK */}
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-cyan-600 hover:underline"
            >
              ← Back
            </button>

            {/* HORIZONTAL CARD */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex gap-6 items-center">

              {/* SMALL IMAGE - LEFT */}
              {course.courseImg && (
                <div className=" bg-gray-50 p-2 rounded-xl">
                  <img
                    src={course.courseImg}
                    alt={course.courseName}
                    className="w-36 h-24 object-contain rounded-lg"/>
                </div>
              )}

              {/* CONTENT - RIGHT */}
              <div className="flex-1 space-y-3">

                {/* LEVEL */}
                <span className="inline-block text-xs px-3 py-1 rounded-full border border-cyan-200 text-cyan-600 font-medium">
                  {course.level}
                </span>

                {/* TITLE */}
                <h1 className="text-xl font-semibold text-gray-900">
                  {course.courseName}
                </h1>

                {/* DESCRIPTION */}
                <p className="text-sm text-gray-600 max-w-xl">
                  {course.description || "No description available"}
                </p>

                {/* DETAILS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
                  <div>
                    <span className="text-gray-500 text-xs">Duration</span>
                    <p className="font-medium text-gray-800">
                      {course.duration}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs">Fee</span>
                    <p className="font-medium text-gray-800">
                      ₹ {course.fee}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs">Mode</span>
                    <p className="font-medium text-gray-800">
                      {course.mode}
                    </p>
                  </div>

                  <div>
                    <span className="text-gray-500 text-xs">Status</span>
                    <p className="font-medium text-gray-800">
                      {course.status || "Active"}
                    </p>
                  </div>
                </div>

                {/* ACTION */}
                <div className="pt-3">
                  <button
                    onClick={() => navigate(`/courses/edit/${course._id}`)}
                    className="px-6 py-2 bg-cyan-600 text-white rounded-full hover:bg-cyan-700 transition">
                    Edit Course
                  </button>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition">
              Back to Courses
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
