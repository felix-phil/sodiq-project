"use client";

import { Button } from "@headlessui/react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FC, useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";

import FormInput from "@/components/common/FormInput";
import FormSelect from "@/components/common/FormSelect";

import { AppUser, Course, Venue } from "@/types";
import { ScheduleModel } from "@/models/Schedule";

interface IProps {
  open?: boolean;
  onDismiss?: () => void;
  lecturers: AppUser[];
  courses: Course[];
  venues: Venue[];
  refresh?: () => void;
}

const CreateScheduleModal: FC<IProps> = ({
  open = false,
  onDismiss,
  lecturers,
  courses,
  venues,
  refresh,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<{
    courseId: string;
    venueId: string;
    lecturerId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>({
    initialValues: {
      courseId: "",
      venueId: "",
      lecturerId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    },
    onSubmit: async (values) => {
      try {
        await ScheduleModel.createSchedule({
          courseId: values.courseId,
          venueId: values.venueId,
          lecturerId: values.lecturerId,
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime,
          endTime: values.endTime,
        });
        formik.resetForm();
        toast.success("Schedule created successfully");
        refresh?.();
        onDismiss?.();
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    validationSchema: Yup.object({
      courseId: Yup.string().required("Required"),
      venueId: Yup.string().required("Required"),
      lecturerId: Yup.string().required("Required"),
      dayOfWeek: Yup.string().required("Required"),
      startTime: Yup.string().required("Required"),
      endTime: Yup.string().required("Required"),
    }),
  });

  return (
    <motion.div
      variants={{
        open: { opacity: 1, visibility: "visible" },
        close: { opacity: 0, visibility: "hidden" },
      }}
      initial="close"
      exit="close"
      animate={open ? "open" : "close"}
      className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-3xl"
    >
      <div
        ref={contentRef}
        className="bg-white w-full lg:w-[600px] max-w-[90vw] self-center mx-auto rounded-lg overflow-hidden flex px-[2%] flex-col justify-center items-center pb-10"
      >
        <div className="w-full h-full flex flex-col items-center py-[2%] divide-y divide-black/50">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-medium text-primary text-2xl py-3">Schedule</h1>
            <IoClose
              size={30}
              onClick={onDismiss}
              className="cursor-pointer text-primary"
            />
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col w-full pt-5"
          >
            {/* Course */}
            <div className="flex flex-col w-full">
              <FormSelect
                name="courseId"
                label="Course"
                options={courses.map((c) => ({
                  label: `${c.title} (${c.code})`,
                  value: c.id,
                }))}
                onChange={(value) => formik.setFieldValue("courseId", value)}
                value={formik.values.courseId}
                error={formik.errors.courseId}
                touched={formik.touched.courseId}
              />
            </div>

            {/* Venue */}
            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="venueId"
                label="Venue"
                options={venues.map((v) => ({
                  label: `${v.name} (${v.type})`,
                  value: v.id,
                }))}
                onChange={(value) => formik.setFieldValue("venueId", value)}
                value={formik.values.venueId}
                error={formik.errors.venueId}
                touched={formik.touched.venueId}
              />
            </div>

            {/* Lecturer */}
            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="lecturerId"
                label="Lecturer"
                options={lecturers.map((l) => ({
                  label: l.fullName,
                  value: l.id,
                }))}
                onChange={(value) => formik.setFieldValue("lecturerId", value)}
                value={formik.values.lecturerId}
                error={formik.errors.lecturerId}
                touched={formik.touched.lecturerId}
              />
            </div>

            {/* Day of week */}
            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="dayOfWeek"
                label="Day of Week"
                options={[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => ({ label: day, value: day }))}
                onChange={(value) => formik.setFieldValue("dayOfWeek", value)}
                value={formik.values.dayOfWeek}
                error={formik.errors.dayOfWeek}
                touched={formik.touched.dayOfWeek}
              />
            </div>

            {/* Start time */}
            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="startTime"
                label="Start Time"
                type="time"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startTime}
                error={
                  formik.touched.startTime && formik.errors.startTime
                    ? formik.errors.startTime
                    : undefined
                }
                touched={formik.touched.startTime}
                placeholder="09:00"
              />
            </div>

            {/* End time */}
            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="endTime"
                label="End Time"
                type="time"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endTime}
                error={
                  formik.touched.endTime && formik.errors.endTime
                    ? formik.errors.endTime
                    : undefined
                }
                touched={formik.touched.endTime}
                placeholder="11:00"
              />
            </div>

            <div className="flex flex-col w-full mt-[5%]">
              <Button
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit"
                className="h-[45px] hover:scale-x-105 transition-all ease-in-out duration-75 disabled:opacity-50 disabled:cursor-not-allowed w-full bg-primary rounded-md overflow-hidden cursor-pointer text-white text-[16px] font-medium"
              >
                Create Schedule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateScheduleModal;