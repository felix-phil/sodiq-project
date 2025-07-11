import { Button } from "@headlessui/react";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import { FC, useRef } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import FormSelect from "@/components/common/FormSelect";
import FormInput from "@/components/common/FormInput";
import { ScheduleModel } from "@/models/Schedule";
import { Schedule, Venue } from "@/types";

interface IProps {
  open?: boolean;
  onDismiss?: () => void;
  schedule?: Schedule;
  venues: Venue[];
  refresh?: () => void;
}

const RescheduleScheduleModal: FC<IProps> = ({
  open = false,
  onDismiss,
  venues,
  refresh,
  schedule,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const formik = useFormik<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    venueId: string;
  }>({
    initialValues: {
      dayOfWeek: schedule?.dayOfWeek ?? "Monday",
      startTime: schedule?.startTime ?? "09:00",
      endTime: schedule?.endTime ?? "11:00",
      venueId: schedule?.venueId ?? "",
    },
    onSubmit: async (values) => {
      try {
        await ScheduleModel.rescheduleClass(schedule?.id ?? "", {
          dayOfWeek: values.dayOfWeek,
          startTime: values.startTime,
          endTime: values.endTime,
          venueId: values.venueId,
        });
        toast.success("Class rescheduled successfully");
        refresh?.();
        onDismiss?.();
      } catch (error) {
        toast.error((error as Error).message);
      }
    },
    validationSchema: Yup.object({
      dayOfWeek: Yup.string().required("Required"),
      startTime: Yup.string().required("Required"),
      endTime: Yup.string().required("Required"),
      venueId: Yup.string().required("Required"),
    }),
    enableReinitialize: true,
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
      className="fixed font-primary inset-0 z-50 flex bg-black/50 backdrop-blur-3xl"
    >
      <div
        ref={contentRef}
        className="bg-white w-full lg:w-[600px] max-w-[90vw] self-center mx-auto rounded-lg overflow-hidden flex px-[2%] flex-col justify-center items-center pb-10"
      >
        <div className="w-full min-h-[80vh] h-full flex flex-col items-center py-[2%] divide-y divide-black/50">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-medium text-primary text-2xl py-3">
              Reschedule Class
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
            <div className="flex flex-col w-full">
              <FormSelect
                name="dayOfWeek"
                label="Day of Week"
                options={[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                ].map((day) => ({
                  label: day,
                  value: day,
                }))}
                onChange={(value) => formik.setFieldValue("dayOfWeek", value)}
                value={formik.values.dayOfWeek}
                error={formik.errors.dayOfWeek}
                touched={formik.touched.dayOfWeek}
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="startTime"
                label="Start Time"
                placeholder="09:00"
                type="time"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startTime}
                error={formik.errors.startTime}
                touched={formik.touched.startTime}
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormInput
                name="endTime"
                label="End Time"
                placeholder="11:00"
                type="time"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endTime}
                error={formik.errors.endTime}
                touched={formik.touched.endTime}
              />
            </div>

            <div className="flex flex-col w-full mt-[3%]">
              <FormSelect
                name="venueId"
                label="Venue"
                options={venues.map((venue) => ({
                  label: venue.name,
                  value: venue.id,
                }))}
                onChange={(value) => formik.setFieldValue("venueId", value)}
                value={formik.values.venueId}
                error={formik.errors.venueId}
                touched={formik.touched.venueId}
              />
            </div>

            <div className="flex flex-col w-full mt-[5%]">
              <Button
                disabled={!formik.isValid || formik.isSubmitting}
                type="submit"
                className="h-[45px] hover:scale-x-105 transition-all ease-in-out duration-75 disabled:opacity-50 disabled:cursor-not-allowed w-full bg-primary rounded-md overflow-hidden cursor-pointer text-white text-[16px] font-medium"
              >
                Reschedule
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default RescheduleScheduleModal;
