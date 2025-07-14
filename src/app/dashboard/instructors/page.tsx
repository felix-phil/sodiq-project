"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AppUser } from "@/types";
import { UserModel } from "@/models/User";

import moment from "moment";

const Instructors = () => {
  const [allInstructors, setAllInstructors] = useState<AppUser[]>([]);

  const fetchInstructors = useCallback(async () => {
    try {
      setAllInstructors(await UserModel.getAllLecturers());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);
  return (
    <div className="flex flex-col font-ins-sans">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Instructors</h1>
      </div>

      <div className="flex flex-col mt-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-lg font-bold text-primary">All Students</h1>
        </div>
        <table className="w-full mt-5 stripped table-fixed">
          <thead>
            <tr className="bg-[#FAFCFF] text-primary ">
              <th className="p-2 py-3 text-left">Email</th>
              <th className="p-2 py-3 text-left">Full Name</th>
              <th className="p-2 py-3 text-left">Number of courses</th>
              <th className="p-2 py-3 text-left">Joined</th>

              {/* <th className="p-2 py-3 text-left">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {allInstructors.map((instructor) => (
              <tr key={instructor?.id} className="bg-white">
                <td className="p-2 py-3 text-left">{instructor?.email}</td>
                <td className="p-2 py-3 text-left">{instructor?.fullName}</td>
                <td className="p-2 py-3 text-left">
                  {instructor.teachingCourseIds?.length ?? 0}
                </td>
                <td className="p-2 py-3 text-left">
                  {moment(instructor?.createdAt).format("DD/MM/YYYY")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Instructors;
