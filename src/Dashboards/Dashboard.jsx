import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import bgImage from "../assets/89124.jpg";
import { callApi } from "../Services/Api";

import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";

export default function Dashboard() {
  const [data, setData] = useState({
    courses: [],
    students: [],
    resumes: [],
    placements: [],
    employees: [],
  });

  const [loading, setLoading] = useState(true);

  //contants
  const STUDENT_FEE = 30000;
  const TEACHER_SALARY = 20000;

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await callApi("/dashboard", "GET");
        setData({
          courses: res?.data?.courses || [],
          students: res?.data?.students || [],
          resumes: res?.data?.resumes || [],
          placements: res?.data?.placements || [],
          employees: res?.data?.employees || [],
        });
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  //fillter
  const activeStudents = data.students.filter(
    (s) => s.status === "Active"
  );

  const teachers = data.employees.filter(
    (e) => e.role === "teacher"
  );

  //calculations
  const totalRevenue = activeStudents.length * STUDENT_FEE;
  const teacherSalary = teachers.length * TEACHER_SALARY;
  const netProfit = totalRevenue - teacherSalary;

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-gray-50">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 px-6 py-6">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* HEADER */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Dashboard
                </h2>
                <p className="text-gray-500 text-sm">
                  Institute performance overview
                </p>
              </div>

              {/* KPI STATS */}
              {!loading && (
                <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <Stat label="Courses" value={data.courses.length} />
                  <Stat label="Students" value={data.students.length} />
                  <Stat label="Active" value={activeStudents.length} />
                  <Stat label="Teachers" value={teachers.length} />
                  <Stat label="Placements" value={data.placements.length} />
                </section>
              )}

              {/* MONEY CARDS */}
              {!loading && (
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <MoneyCard
                    title="Total Revenue"
                    value={`₹${(totalRevenue / 100000).toFixed(2)}L`}
                    subtitle={`${activeStudents.length} students × ₹30,000`}
                    gradient="from-green-50 to-white"
                    text="text-green-700"
                  />

                  <MoneyCard
                    title="Teacher Salary Expense"
                    value={`₹${(teacherSalary / 1000).toFixed(0)}K`}
                    subtitle={`${teachers.length} teachers × ₹20,000`}
                    gradient="from-red-50 to-white"
                    text="text-red-600"
                  />

                  <MoneyCard
                    title="Net Profit / Loss"
                    value={`₹${(netProfit / 100000).toFixed(2)}L`}
                    subtitle="Revenue − Salary"
                    gradient={
                      netProfit >= 0
                        ? "from-emerald-50 to-white"
                        : "from-rose-50 to-white"
                    }
                    text={
                      netProfit >= 0
                        ? "text-emerald-700"
                        : "text-red-700"
                    }
                  />

                </section>
              )}

              {/* COURSES & STUDENTS */}
              {!loading && (
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* COURSES */}
                  <Card title="Courses">
                    {data.courses.slice(0, 4).map((c) => (
                      <Row
                        key={c._id}
                        title={c.courseName}
                        subtitle={`Duration: ${c.duration}`}
                      />
                    ))}
                  </Card>

                  {/* STUDENTS */}
                  <Card title="Active Students">
                    {activeStudents.slice(0, 4).map((s) => (
                      <Row
                        key={s._id}
                        title={s.name}
                        subtitle={s.course}
                      />
                    ))}
                  </Card>

                </section>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition border border-cyan-200">
    <p className="text-[11px] text-gray-500 uppercase tracking-wide">
      {label}
    </p>
    <p className="text-2xl font-semibold text-gray-900 mt-1">
      {value}
    </p>
  </div>
);

const MoneyCard = ({ title, value, subtitle, gradient, text }) => (
  <div className={`rounded-2xl p-6 bg-gradient ${gradient} shadow border border-cyan-200`}>
    <p className="text-xs text-gray-500 uppercase">
      {title}
    </p>
    <p className={`text-3xl font-bold mt-2 ${text}`}>
      {value}
    </p>
    <p className="text-xs text-gray-500 mt-1">
      {subtitle}
    </p>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-cyan-200">
    <h3 className="font-semibold text-gray-900 mb-4">
      {title}
    </h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const Row = ({ title, subtitle }) => (
  <div className="bg-gray-50 rounded-lg px-4 py-3">
    <p className="text-sm font-medium text-gray-900">
      {title}
    </p>
    <p className="text-xs text-gray-500">
      {subtitle}
    </p>
  </div>
);
