"use client";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { BiPlus } from "react-icons/bi";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import CreateScheduleModal from "./CreateScheduleModal";
import { AppUser, Course, ScheduleFullDetails, Venue } from "@/types";
import useAuth from "@/hooks/use-auth";
import { ScheduleModel } from "@/models/Schedule";
import { transformSchedulesToEvents } from "@/helpers";
import ManageStudentEnrollmentsModal from "./EnrollCourseModal";
import { CourseModel } from "@/models/Courses";

const localizer = momentLocalizer(moment);
const SchedulePageConponent: FC<{
  lecturers?: AppUser[];
  courses?: Course[];
  venues?: Venue[];
  refresh?: () => void;
}> = ({ lecturers = [], courses = [], venues = [] }) => {
  const [openForm, setOpenForm] = useState(false);
  const [openEnrollForm, setOpenEnrollForm] = useState(false);
  const [studentEnrolledCourses, setStudentEnrolledCourses] = useState<
    string[]
  >([]);
  const auth = useAuth();
  const [schedules, setSchedules] = useState<ScheduleFullDetails[]>([]);

  const fetchSchedules = useCallback(async () => {
    try {
      let fetchedSchedules: ScheduleFullDetails[] = [];
      if (auth.user?.role === "admin") {
        fetchedSchedules = await ScheduleModel.getAllSchedulesWithDetails();
      } else if (auth.user?.role === "lecturer") {
        fetchedSchedules =
          await ScheduleModel.getSchedulesByLecturerWithDetails(auth.user.id);
      } else if (auth.user?.role === "student") {
        fetchedSchedules = await ScheduleModel.getSchedulesByStudentWithDetails(
          auth.user.id
        );
      }
      setSchedules(fetchedSchedules);
    } catch (error) {
      console.log(error);
    }
  }, [auth.user?.id, auth.user?.role]);
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      const enrolledCourses = await CourseModel.getEnrolledCourses(
        auth.user?.id ?? ""
      );
      setStudentEnrolledCourses(enrolledCourses.map((course) => course.id));
    } catch (error) {
      console.log(error);
    }
  }, [auth.user?.id]);
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);
  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const events = transformSchedulesToEvents(schedules);
  // console.log("Schedules:", schedules);
  return (
    <div className="flex flex-col h-[90%] w-full font-ins-sans gap-y-5">
      <div className="flex flex-row">
        {auth.user?.role !== "student" && (
          <button
            onClick={() => setOpenForm(true)}
            className="bg-primary ml-auto text-white px-4 py-1 cursor-pointer rounded-md flex flex-row items-center gap-2"
          >
            <BiPlus /> Create Schedule
          </button>
        )}
        {auth.user?.role === "student" && (
          <button
            onClick={() => setOpenEnrollForm(true)}
            className="bg-primary ml-auto text-white px-4 py-1 cursor-pointer rounded-md flex flex-row items-center gap-2"
          >
            Enroll in a course
          </button>
        )}
      </div>
      <div className="w-full flex-1 overflow-auto">
        <Calendar
          localizer={localizer}
          defaultView="week"
          events={events}
          startAccessor="start"
          endAccessor="end"
          className="h-full w-full"
        />
      </div>
      <CreateScheduleModal
        open={openForm}
        onDismiss={() => setOpenForm(false)}
        lecturers={lecturers}
        courses={courses}
        venues={venues}
        refresh={fetchSchedules}
      />
      <ManageStudentEnrollmentsModal
        open={openEnrollForm}
        courses={courses}
        onDismiss={() => setOpenEnrollForm(false)}
        refresh={fetchSchedules}
        enrolledCourseIds={studentEnrolledCourses}
      />
    </div>
  );
};

export default SchedulePageConponent;
