"use client";
import React, { FC, useCallback, useState } from "react";
import CreateCourseModal from "./CreateCourseModal";
import { AppUser, Course } from "@/types";
import { CourseModel } from "@/models/Courses";

const CoursesPage: FC<{ lecturers: AppUser[]; allCourses: Course[] }> = ({
  lecturers,
  allCourses: initialCourses,
}) => {
  const [openCreate, setOpenCreate] = useState(false);
  const lecturersById = new Map(
    lecturers.map((lecturer) => [lecturer.id, lecturer])
  );
  const [allCourses, setAllCourses] = useState(initialCourses);

  const fetchCourses = useCallback(async () => {
    try {
      setAllCourses(await CourseModel.getAllCourses());
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="flex flex-col font-ins-sans">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Courses</h1>
        <button
          onClick={() => setOpenCreate(true)}
          className="bg-primary text-white px-4 py-2 rounded-md cursor-pointer"
        >
          Add Course
        </button>
      </div>

      <CreateCourseModal
        open={openCreate}
        onDismiss={() => setOpenCreate(false)}
        lecturers={lecturers}
        refresh={fetchCourses}
      />
      <div className="flex flex-col mt-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-lg font-bold text-primary">All Courses</h1>
        </div>
        <table className="w-full mt-5 stripped table-fixed">
          <thead>
            <tr className="bg-[#FAFCFF] text-primary ">
              <th className="p-2 py-3 text-left">Title</th>
              <th className="p-2 py-3 text-left">Code</th>
              <th className="p-2 py-3 text-left">Credit Units</th>
              <th className="p-2 py-3 text-left">Lecturer</th>
              <th className="p-2 py-3 text-left">Level</th>
              <th className="p-2 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allCourses?.map((course) => (
              <tr key={course.id}>
                <td className="p-2">{course.title}</td>
                <td className="p-2">{course.code}</td>
                <td className="p-2">{course.creditUnits}</td>
                <td className="p-2">
                  {lecturersById.get(course.lecturerId)?.fullName}
                </td>
                <td className="p-2">{course.level}</td>
                <td className="p-2">
                  <button
                    onClick={() => {
                      CourseModel.deleteCourse(course.id);
                      fetchCourses();
                    }}
                    className="bg-red-400 text-white px-4 py-2 rounded-md cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesPage;
