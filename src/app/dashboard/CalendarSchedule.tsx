import { VenueModel } from "@/models/Labs";
import { ScheduleFullDetails, Venue } from "@/types";
import moment from "moment";
import React, { FC, useEffect, useState } from "react";
import RescheduleScheduleModal from "./RescheduleModal";
import useAuth from "@/hooks/use-auth";

const CalendarSchedules: FC<{
  schedules?: ScheduleFullDetails[];
}> = ({ schedules }) => {
  const [allVenues, setAllVenues] = useState<Venue[]>([]);
  const [rescheduleProps, setRescheduleProps] = useState({
    open: false,
    schedule: undefined as ScheduleFullDetails | undefined,
  });
  const auth = useAuth();
  useEffect(() => {
    (async () => {
      try {
        const venues = await VenueModel.getAllVenues();
        setAllVenues(venues);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col">
      <h4 className="text-[#61698D] font-ins-sans text-[20px]">
        Calendar Schedule
      </h4>
      <div className="w-full font-ins-sans gap-y-5 flex flex-col mt-5 px-5 py-5 border border-[#E3E3E3] rounded-[10px]">
        {schedules?.map((sched) => (
          <div className="flex flex-row items-center" key={sched.id}>
            <div className="flex flex-col  text-[#375DFB] items-center justify-center pr-8">
              <h3 className="text-[14px] font-medium">
                {moment(sched.dayOfWeek, "dddd").format("ddd")}
              </h3>
              <h2 className="text-[32px] font-semibold leading-[25px]">
                {new Date().getDate()}
              </h2>
            </div>
            <div className="w-[1px] h-[50px] bg-[#D8D8D8] items-center"></div>
            <div className="pl-8 flex flex-col mr-auto">
              <h4 className="text-[#001A3D] text-lg font-medium">
                {sched.course?.code}
                {" - "}
                {sched.course?.title}
              </h4>
              <div className="flex flex-row items-center gap-x-5 mt-2">
                <div className="flex flex-row gap-x-1 items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.00004 8.95334C9.1488 8.95334 10.08 8.02209 10.08 6.87334C10.08 5.72458 9.1488 4.79333 8.00004 4.79333C6.85129 4.79333 5.92004 5.72458 5.92004 6.87334C5.92004 8.02209 6.85129 8.95334 8.00004 8.95334Z"
                      stroke="#00A819"
                    />
                    <path
                      d="M2.4133 5.66004C3.72664 -0.113291 12.28 -0.106624 13.5866 5.66671C14.3533 9.05338 12.2466 11.92 10.4 13.6934C9.05997 14.9867 6.93997 14.9867 5.5933 13.6934C3.7533 11.92 1.64664 9.04671 2.4133 5.66004Z"
                      stroke="#00A819"
                    />
                  </svg>
                  <h5 className="text-[#787878] text-[14px]">
                    {sched.venue?.name}
                  </h5>
                </div>
                <div className="flex flex-row gap-x-1 items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.6667 8.00004C14.6667 11.68 11.68 14.6667 8.00004 14.6667C4.32004 14.6667 1.33337 11.68 1.33337 8.00004C1.33337 4.32004 4.32004 1.33337 8.00004 1.33337C11.68 1.33337 14.6667 4.32004 14.6667 8.00004Z"
                      stroke="#F24822"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.4733 10.12L8.40663 8.88671C8.04663 8.67338 7.7533 8.16005 7.7533 7.74005V5.00671"
                      stroke="#F24822"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h5 className="text-[#787878] text-[14px]">
                    {moment(sched.startTime, "HH:mm").format("hh:mm A")}
                  </h5>
                </div>
                <div className="flex flex-row gap-x-1 items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.08002 8.51999C8.03335 8.51332 7.97335 8.51332 7.92002 8.51999C6.74669 8.47999 5.81335 7.51999 5.81335 6.33999C5.81335 5.13332 6.78669 4.15332 8.00002 4.15332C9.20669 4.15332 10.1867 5.13332 10.1867 6.33999C10.18 7.51999 9.25335 8.47999 8.08002 8.51999Z"
                      stroke="#9747FF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.4933 12.92C11.3067 14.0067 9.73332 14.6667 7.99999 14.6667C6.26665 14.6667 4.69332 14.0067 3.50665 12.92C3.57332 12.2934 3.97332 11.68 4.68665 11.2C6.51332 9.98671 9.49999 9.98671 11.3133 11.2C12.0267 11.68 12.4267 12.2934 12.4933 12.92Z"
                      stroke="#9747FF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99998 14.6667C11.6819 14.6667 14.6666 11.6819 14.6666 8.00004C14.6666 4.31814 11.6819 1.33337 7.99998 1.33337C4.31808 1.33337 1.33331 4.31814 1.33331 8.00004C1.33331 11.6819 4.31808 14.6667 7.99998 14.6667Z"
                      stroke="#9747FF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h5 className="text-[#787878] capitalize text-[14px]">
                    {sched.lecturer.fullName}
                  </h5>
                </div>
              </div>
            </div>
            <div className="ml-auto flex flex-row items-center gap-x-5 font-medium">
              {(auth.user?.role === "admin" ||
                auth.user?.id === sched.lecturerId) && (
                <button
                  onClick={() =>
                    setRescheduleProps({ open: true, schedule: sched })
                  }
                  className="px-5 py-2 cursor-pointer text-[14px] text-[#141859] rounded-md border-[#141859] border"
                >
                  Reschedule Class
                </button>
              )}
              <button className="h-[36px] flex items-center justify-center aspect-square rounded-sm border border-[#14185940]">
                <svg
                  width="18"
                  height="4"
                  viewBox="0 0 18 4"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 3C9.55228 3 10 2.55228 10 2C10 1.44772 9.55228 1 9 1C8.44772 1 8 1.44772 8 2C8 2.55228 8.44772 3 9 3Z"
                    stroke="#141859"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 3C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3Z"
                    stroke="#141859"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                    stroke="#141859"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <RescheduleScheduleModal
        schedule={rescheduleProps.schedule}
        open={rescheduleProps.open}
        onDismiss={() =>
          setRescheduleProps({
            ...rescheduleProps,
            open: false,
            schedule: undefined,
          })
        }
        venues={allVenues}
      />
    </div>
  );
};

export default CalendarSchedules;
