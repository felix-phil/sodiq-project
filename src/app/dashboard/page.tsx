"use client";
import React, { useCallback, useEffect, useState } from "react";
import DashboardStats from "./DashboardStats";
import useAuth from "@/hooks/use-auth";
import { ScheduleFullDetails } from "@/types";
import { CourseModel } from "@/models/Courses";
import { ScheduleModel } from "@/models/Schedule";
import { uniqueStringArray } from "@/helpers";
import { UserModel } from "@/models/User";
import { VenueModel } from "@/models/Labs";
import CalendarSchedules from "./CalendarSchedule";

const DashboardHome = () => {
  const auth = useAuth();
  const [totalCourses, setTotalCourses] = useState(0);
  const [upcomingClasses, setUpcomingClasses] = useState<ScheduleFullDetails[]>(
    []
  );
  const [totalStudents, setTotalStudents] = useState(0);
  const [upcomingLabs, setUpcomingLabs] = useState(0);
  const [allLabs, setAllLabs] = useState(0);

  const fetchStats = useCallback(async () => {
    try {
      let totalCourses = 0;
      let upcomingClassesSchedules: ScheduleFullDetails[] = [];
      if (auth.user?.role === "admin") {
        totalCourses = (await CourseModel.getAllCourses()).length;
        upcomingClassesSchedules =
          await ScheduleModel.getTodaySchedulesForAdmin();
        const upcominglabs = uniqueStringArray(
          upcomingClassesSchedules.map((schedule) => schedule.venueId)
        );
        setUpcomingLabs(upcominglabs.length);
        setTotalStudents((await UserModel.getAllStudents()).length);
        setAllLabs((await VenueModel.getAllVenues()).length);
      } else if (auth.user?.role === "lecturer") {
        totalCourses = (await CourseModel.getCoursesByLecturer(auth.user.id))
          .length;
        upcomingClassesSchedules =
          await ScheduleModel.getTodaySchedulesForLecturer(auth.user.id);
        setTotalStudents(
          await ScheduleModel.getTotalStudentsForLecturer(auth.user.id)
        );
      } else if (auth.user?.role === "student") {
        totalCourses = (await CourseModel.getEnrolledCourses(auth.user.id))
          .length;
        upcomingClassesSchedules =
          await ScheduleModel.getTodaySchedulesForStudent(auth.user.id);
      }
      setTotalCourses(totalCourses);
      setUpcomingClasses(upcomingClassesSchedules);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  }, [auth.user?.id, auth.user?.role]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);
  return (
    <div className="h-full w-full overflow-y-scroll flex flex-col pb-10">
      <div className="my-4">
        <h1 className="text-[#001A3D] font-ins-sans text-[20px] font-medium">
          Hello {auth.user?.fullName}
        </h1>
        {(auth.user?.role === "student" || auth.user?.role === "lecturer") && (
          <p className="text-[#8D949E] text-[18px] font-ins-sans font-medium">
            You have {upcomingClasses.length} classes today
          </p>
        )}
      </div>
      <DashboardStats
        totalCourses={totalCourses}
        upcomingClasses={upcomingClasses.length}
        totalStudents={totalStudents}
        upcomingLabs={upcomingLabs}
        allLabs={allLabs}
      />
      <div className="mt-7">
        <CalendarSchedules schedules={upcomingClasses} />
      </div>
    </div>
  );
};

export default DashboardHome;
