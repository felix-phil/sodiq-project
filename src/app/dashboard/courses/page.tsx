import React from "react";

import CoursesPage from "./CoursesPage";
import { UserModel } from "@/models/User";
import { CourseModel } from "@/models/Courses";

const CoursesClientPage = async () => {
  const lecturers = await UserModel.getAllLecturers();
  const allCourses = await CourseModel.getAllCourses();

  return <CoursesPage lecturers={lecturers} allCourses={allCourses} />;
};

export default CoursesClientPage;
