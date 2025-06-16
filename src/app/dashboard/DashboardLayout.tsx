"use client";
import React, { FC, useState } from "react";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";
import DashboardTop from "./DashboardTop";
import useAuth from "@/hooks/use-auth";
import LogingModal from "@/components/utils/LoginModal";
import { ToastContainer } from "react-toastify";

const DashboardLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(true);
  const auth = useAuth();
  return (
    <div className="h-screen w-screen flex flex-row">
      <motion.div
        variants={{
          out: {
            width: 0,
            visibility: "hidden",
            opacity: 0,
          },
          in: {
            width: 294,
            maxWidth: "20%",
            visibility: "visible",
            opacity: 1,
          },
        }}
        initial="in"
        exit={"out"}
        animate={openSidebar ? "in" : "out"}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="w-1/5 bg-primary"
      >
        <Sidebar closeSidebar={() => setOpenSidebar(false)} />
      </motion.div>
      <div className="flex-1 h-screen flex flex-col">
        <div className="h-[10%] bg-[#FAFCFF] border-1 border-[#F2F2F2]">
          <DashboardTop
            openSidebar={() => setOpenSidebar(true)}
            open={openSidebar}
          />
        </div>
        <div className="flex-1 h-[90%] pt-[24px] px-[5%]">{children}</div>
      </div>
      <LogingModal open={!auth.user} onDismiss={() => {}} />
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default DashboardLayout;
