import React, { useEffect, useState } from "react";
import { callApi } from "../Services/Api";

export default function EditStudent({
  student,
  onClose,
  onUpdated,
}) {
  const [formData, setFormData] = useState(student);

  useEffect(() => {
    setFormData(student);
  }, [student]);

  if (!formData) return null;

  /* UPDATE */
  const handleUpdate = async () => {
    try {
      const res = await callApi(
        `/students/${formData._id}`,
        "PUT",
        formData
      );
      onUpdated(res.data);
      onClose();
    } catch (err) {
      console.error("Update student error:", err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-cyan-300 shadow-lg">
      <h2 className="text-2xl font-semibold mb-1">
        Edit Student
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Update student details.
      </p>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          placeholder="Full name *"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="input"
        />

        <select
          value={formData.gender}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
          className="input"
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <input
          placeholder="Age"
          value={formData.age}
          onChange={(e) =>
            setFormData({ ...formData, age: e.target.value })
          }
          className="input"
        />

        <input
          placeholder="Qualification"
          value={formData.qualification}
          onChange={(e) =>
            setFormData({
              ...formData,
              qualification: e.target.value,
            })
          }
          className="input"
        />

        <input
          placeholder="Email *"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="input"
        />

        <input
          placeholder="Phone *"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="input"
        />

        <input
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="input md:col-span-2"
        />

        <input
          placeholder="Course *"
          value={formData.course}
          onChange={(e) =>
            setFormData({ ...formData, course: e.target.value })
          }
          className="input"
        />

        <input
          placeholder="Batch"
          value={formData.batch}
          onChange={(e) =>
            setFormData({ ...formData, batch: e.target.value })
          }
          className="input"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col md:flex-row gap-3 mt-8">
        <button
          onClick={handleUpdate}
          className="flex-1 bg-cyan-600 text-white py-3 rounded-full hover:bg-cyan-700"
        >
          Update Student
        </button>

        {/* DELETE BUTTON REMOVED */}

        <button
          onClick={onClose}
          className="px-6 py-3 border rounded-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
