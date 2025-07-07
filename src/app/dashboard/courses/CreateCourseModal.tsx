import { Button } from "@headlessui/react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FC, useRef } from "react";
import * as Yup from "yup";

import { toast } from "react-toastify";

import { AppUser } from "@/types";
import { IoClose } from "react-icons/io5";
import FormInput from "@/components/common/FormInput";
import FormSelect from "@/components/common/FormSelect";
import { CourseModel } from "@/models/Courses";
interface IProps {
  open?: boolean;
  onDismiss?: () => void;
  lecturers: AppUser[];
  refresh?: () => void;
}

const CreateCourseModal: FC<IProps> = ({
  open = false,
  onDismiss,
  lecturers,
  refresh,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<{
    title: string;
    code: string;
    creditUnits: number;
    lecturerId: string;
    level: number;
  }>({
    initialValues: {
      title: "",
      code: "",
      creditUnits: 1,
      lecturerId: "",
      level: 100,
    },
    onSubmit: async (values) => {
      try {
        await CourseModel.createCourse({
          title: values.title,
          code: values.code,
          creditUnits: Number(values.creditUnits),
          lecturerId: values.lecturerId,
          level: Number(values.level),
        });
        formik.resetForm();
        toast.success("Course created successfully");
        refresh?.();
        onDismiss?.();
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
      creditUnits: Yup.number().required("Required"),
      lecturerId: Yup.string().required("Required"),
      level: Yup.number().required("Required"),
    }),
  });
  return (
    <motion.div
      variants={{
        open: { opacity: 1, visibility: "visible" },
        close: { opacity: 0, visibility: "hidden" },
      }}
      initial="close"
      exit={"close"}
      animate={open ? "open" : "close"}
      className="fixed font-primary inset-0 z-50 flex  bg-black/50 backdrop-blur-3xl"
    >
      <div
        ref={contentRef}
        className="bg-white 
            w-full   
            lg:w-[600px]
            max-w-[90vw]
            
            self-center
            mx-auto
            rounded-lg
            overflow-hidden flex px-[2%] flex-col justify-center items-center pb-10"
      >
        <div className="w-full h-full flex flex-col items-center py-[2%] divide-y divide-black/50">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-medium font-ins-sans text-primary text-2xl py-3">
              Course
            </h1>
            <IoClose
              size={30}
              onClick={onDismiss}
              className="cursor-pointer text-primary"
            />
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col w-full pt-5 font-ins-sans"
          >
            <div className="flex flex-col w-full">
              <FormInput
                name="title"
                label="Course Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                error={
                  formik.touched.title && formik.errors.title
                    ? formik.errors.title
                    : undefined
                }
                touched={formik.touched.title}
                placeholder="Enter course title"
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="code"
                label="Course Code"
                onChange={(e) =>
                  formik.setFieldValue("code", e.target.value.toUpperCase())
                }
                onBlur={formik.handleBlur}
                value={formik.values.code}
                error={
                  formik.touched.code && formik.errors.code
                    ? formik.errors.code
                    : undefined
                }
                touched={formik.touched.code}
                placeholder="CSC101"
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="creditUnits"
                label="Credit Units"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.creditUnits}
                error={
                  formik.touched.creditUnits && formik.errors.creditUnits
                    ? formik.errors.creditUnits
                    : undefined
                }
                touched={formik.touched.creditUnits}
                placeholder="3"
              />
            </div>
            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="lecturerId"
                label="Lecturer"
                options={lecturers.map((lecturer) => ({
                  label: lecturer.fullName,
                  value: lecturer.id,
                }))}
                onChange={(value) => formik.setFieldValue("lecturerId", value)}
                value={formik.values.lecturerId}
                error={formik.errors.lecturerId}
                touched={formik.touched.lecturerId}
              />
            </div>
            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="level"
                label="Level"
                options={[100, 200, 300, 400, 500].map((level) => ({
                  label: level + " Level",
                  value: level,
                }))}
                onChange={(value) => formik.setFieldValue("level", value)}
                value={formik.values.level}
                error={formik.errors.level}
                touched={formik.touched.level}
              />
            </div>
            <div className="flex flex-col w-full mt-[5%]">
              <Button
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit"
                className={
                  "h-[45px] hover:scale-x-105 transition-all ease-in-out duration-75 disabled:opacity-50 disabled:cursor-not-allowed w-full bg-primary rounded-md overflow-hidden cursor-pointer text-white text-[16px] font-medium"
                }
              >
                Create Course
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateCourseModal;
