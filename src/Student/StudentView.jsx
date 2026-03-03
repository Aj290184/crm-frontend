import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import bgImage from "../assets/89124.jpg";
import Sidebar from "../Dashboards/Sidebar";
import Header from "../Dashboards/Header";
import { callApi } from "../Services/Api";

export default function StudentView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await callApi(`/students/${id}`, "GET");
        setStudent(res?.data || null);
      } catch (err) {
        console.error("Fetch student error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading student...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-10 text-gray-600">
        Student not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${bgImage})` }}/>
      <div className="absolute inset-0 bg-gray-50 backdrop-blur-sm" />

      <div className="relative z-20 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header userName="Student Profile" />

          <main className="flex-1 px-4 md:px-8 py-8">
            <div className="max-w-4xl mx-auto space-y-6">

              {/* BACK */}
              <button
                onClick={() => navigate(-1)}
                className="text-cyan-600 text-sm hover:underline"
              >
                ← Back
              </button>

              {/* PROFILE CARD */}
              <article className="bg-white border border-cyan-300 rounded-2xl p-6 md:p-8">

                {/* TOP SECTION */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                  {/* IMAGE */}
                  <div className="h-28 w-28 rounded-full overflow-hidden bg-cyan-50
                    flex items-center justify-center">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-cyan-700 font-bold text-3xl">
                        {student.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    )}
                  </div>

                  {/* BASIC INFO */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {student.name}
                    </h2>

                    <p className="text-sm text-gray-600 mt-1">
                      {student.email}
                    </p>

                    <p className="text-sm text-gray-600">
                      {student.phone}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${
                        student.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : student.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {student.status}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <p><b>Gender:</b> {student.gender}</p>
                  <p><b>Age:</b> {student.age}</p>
                  <p><b>Qualification:</b> {student.qualification}</p>
                  <p><b>Course:</b> {student.course}</p>
                  <p><b>Batch:</b> {student.batch}</p>

                  {student.address && (
                    <p className="md:col-span-2">
                      <b>Address:</b> {student.address}
                    </p>
                  )}
                </div>

                {/* FOOTER */}
                <p className="mt-6 text-xs text-gray-500">
                  Joined on{" "}
                  {student.createdAt
                    ? new Date(student.createdAt).toLocaleDateString()
                    : ""}
                </p>

              </article>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
