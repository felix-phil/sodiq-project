import { Button } from "@headlessui/react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FC, useRef } from "react";
import * as Yup from "yup";

import { toast } from "react-toastify";

import { IoClose } from "react-icons/io5";
import FormInput from "@/components/common/FormInput";
import FormSelect from "@/components/common/FormSelect";
import { VenueModel } from "@/models/Labs";
interface IProps {
  open?: boolean;
  onDismiss?: () => void;
  refresh?: () => void;
}

const CreateLabModal: FC<IProps> = ({ open = false, onDismiss, refresh }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<{
    name: string;
    capacity: number;
    location: string;
    type: "lab" | "lecture_hall" | "seminar_room";
  }>({
    initialValues: {
      name: "",
      capacity: 200,
      location: "",
      type: "lab",
    },
    onSubmit: async (values) => {
      try {
        await VenueModel.createVenue({
          capacity: values.capacity,
          location: values.location,
          name: values.name,
          type: values.type,
        });
        formik.resetForm();
        toast.success("Venue created successfully");
        refresh?.();
        onDismiss?.();
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Venue name is required"),
      capacity: Yup.number().required("Capacity is required"),
      location: Yup.string().required("Location is required"),
      type: Yup.string().required("Type is required"),
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
                name="name"
                label="Venue Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={
                  formik.touched.name && formik.errors.name
                    ? formik.errors.name
                    : undefined
                }
                touched={formik.touched.name}
                placeholder="Lecture Hall 1"
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="capacity"
                label="Capacity"
                type="number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.capacity}
                error={
                  formik.touched.capacity && formik.errors.capacity
                    ? formik.errors.capacity
                    : undefined
                }
                touched={formik.touched.capacity}
                placeholder="200"
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="location"
                label="Location"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.location}
                error={
                  formik.touched.location && formik.errors.location
                    ? formik.errors.location
                    : undefined
                }
                touched={formik.touched.location}
                placeholder="Main Block"
              />
            </div>
            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="type"
                label="Type"
                options={[
                  { label: "Lab", value: "lab" },
                  { label: "Lecture Hall", value: "lecture_hall" },
                  { label: "Seminar Room", value: "seminar_room" },
                ]}
                onChange={(value) => formik.setFieldValue("type", value)}
                value={formik.values.type}
                error={formik.errors.type}
                touched={formik.touched.type}
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
                Create Venue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreateLabModal;
