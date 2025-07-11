import { Button } from "@headlessui/react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FC, useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { Course } from "@/types";
import { CourseModel } from "@/models/Courses";
import useAuth from "@/hooks/use-auth";

interface IProps {
  open?: boolean;
  onDismiss?: () => void;
  enrolledCourseIds?: string[];
  courses: Course[];
  refresh?: () => void;
}

const ManageStudentEnrollmentsModal: FC<IProps> = ({
  open = false,
  onDismiss,
  enrolledCourseIds = [],
  courses,
  refresh,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const auth = useAuth();
  const formik = useFormik<{
    enrolledCourseIds: string[];
  }>({
    initialValues: {
      enrolledCourseIds: enrolledCourseIds || [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      enrolledCourseIds: Yup.array().min(1, "Select at least one course"),
    }),
    onSubmit: async (values) => {
      try {
        await CourseModel.updateStudentEnrollments(
          auth.user?.id ?? "",
          values.enrolledCourseIds
        );
        toast.success("Enrollments updated");
        refresh?.();
        onDismiss?.();
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
  });

  const handleCheckboxChange = (courseId: string) => {
    const isChecked = formik.values.enrolledCourseIds.includes(courseId);

    if (isChecked) {
      formik.setFieldValue(
        "enrolledCourseIds",
        formik.values.enrolledCourseIds.filter((id) => id !== courseId)
      );
    } else {
      formik.setFieldValue("enrolledCourseIds", [
        ...formik.values.enrolledCourseIds,
        courseId,
      ]);
    }
  };

  return (
    <motion.div
      variants={{
        open: { opacity: 1, visibility: "visible" },
        close: { opacity: 0, visibility: "hidden" },
      }}
      initial="close"
      exit="close"
      animate={open ? "open" : "close"}
      className="fixed font-primary inset-0 z-50 flex bg-black/50 backdrop-blur-3xl"
    >
      <div
        ref={contentRef}
        className="bg-white w-full lg:w-[600px] max-w-[90vw] self-center mx-auto rounded-lg overflow-hidden flex px-[2%] flex-col justify-center items-center pb-10"
      >
        <div className="w-full h-full flex flex-col items-center py-[2%] divide-y divide-black/50">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-medium text-primary text-2xl py-3">
              Manage Enrollments
            </h1>
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
            <div className="flex flex-col w-full gap-3">
              {courses.map((course) => (
                <label
                  key={course.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formik.values.enrolledCourseIds.includes(
                      course.id
                    )}
                    onChange={() => handleCheckboxChange(course.id)}
                    className="w-5 h-5"
                  />
                  <span>
                    {course.code} — {course.title}
                  </span>
                </label>
              ))}
            </div>
            {formik.touched.enrolledCourseIds &&
              formik.errors.enrolledCourseIds && (
                <span className="text-red-500 text-sm mt-2">
                  {formik.errors.enrolledCourseIds}
                </span>
              )}

            <div className="flex flex-col w-full mt-[5%]">
              <Button
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit"
                className="h-[45px] hover:scale-x-105 transition-all ease-in-out duration-75 disabled:opacity-50 disabled:cursor-not-allowed w-full bg-primary rounded-md overflow-hidden cursor-pointer text-white text-[16px] font-medium"
              >
                Update Enrollments
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ManageStudentEnrollmentsModal;
