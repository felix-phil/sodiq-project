"use client";
import { UserModel } from '@/models/User';
import { AppUser } from '@/types';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'

const StudentsPage = () => {
  const [allStudents, setAllStudents] = useState<AppUser[]>([]);
  
    const fetchStudents = useCallback(async () => {
      try {
        setAllStudents(await UserModel.getAllStudents());
      } catch (error) {
        console.error(error);
      }
    }, []);
  
    useEffect(() => {
      fetchStudents();
    }, [fetchStudents]);
  return (
     <div className="flex flex-col font-ins-sans">
          <div className="flex flex-row items-center justify-between">
            <h1 className="text-2xl font-bold text-primary">Students</h1>
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
                {allStudents.map((student) => (
                  <tr key={student.id} className="bg-white">
                    <td className="p-2 py-3 text-left">{student.email}</td>
                    <td className="p-2 py-3 text-left">{student.fullName}</td>
                    <td className="p-2 py-3 text-left">
                      {student.enrolledCourseIds?.length ?? 0}
                    </td>
                    <td className="p-2 py-3 text-left">
                      {moment(student.createdAt).format("DD/MM/YYYY")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
  )
}

export default StudentsPage