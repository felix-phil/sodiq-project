import Image from "next/image";
import React, { FC } from "react";
import { IoSearchOutline } from "react-icons/io5";
const DashboardTop: FC<{ openSidebar: () => void; open: boolean }> = ({
  openSidebar,
  open,
}) => {
  return (
    <div className="w-full h-full flex flex-row justify-between pl-[2%] pr-[5%] items-center">
      {!open && (
        <button onClick={openSidebar} className="cursor-pointer ">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.66687 6.50826V13.4916C1.66687 14.7333 1.96687 15.7666 2.54187 16.5583C2.78354 16.9083 3.09187 17.2166 3.44187 17.4583C4.1252 17.9583 4.99187 18.2499 6.01687 18.3166V1.69159C3.28354 1.86659 1.66687 3.64159 1.66687 6.50826Z"
              fill="#141859"
            />
            <path
              d="M17.4585 3.44157C17.2168 3.09157 16.9085 2.78323 16.5585 2.54156C15.7668 1.96656 14.7335 1.66656 13.4918 1.66656H7.26685V18.3332H13.4918C16.5252 18.3332 18.3335 16.5249 18.3335 13.4916V6.50823C18.3335 5.26656 18.0335 4.23323 17.4585 3.44157ZM12.9168 11.6916C13.1585 11.9332 13.1585 12.3332 12.9168 12.5749C12.7918 12.6999 12.6335 12.7582 12.4752 12.7582C12.3168 12.7582 12.1585 12.6999 12.0335 12.5749L9.90018 10.4416C9.65851 10.1999 9.65851 9.7999 9.90018 9.55823L12.0335 7.4249C12.2752 7.18323 12.6752 7.18323 12.9168 7.4249C13.1585 7.66656 13.1585 8.06657 12.9168 8.30823L11.2335 9.9999L12.9168 11.6916Z"
              fill="#141859"
            />
          </svg>
        </button>
      )}
      <div className="h-full flex flex-row items-center gap-x-3">
        <IoSearchOutline className="text-2xl text-[#959CA5]" />
        <input
          className="h-full text-primary w-[220px] font-medium max-w-[45vw] placeholder:text-[#959CA5] outline-none"
          placeholder="Search for a course, schedule..."
        />
      </div>
      <div className="flex flex-row divide-x divide-[#00000] gap-x-5">
        <button className="border h-[36px] aspect-square border-[#CBD5E1] rounded-full flex items-center justify-center">
          <svg
            width="16"
            height="15"
            viewBox="0 0 16 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.8249 10.7167L13.8833 9.15006C13.6749 8.8084 13.4916 8.15006 13.4916 7.75006V6.19173C13.4916 3.16673 11.0333 0.708397 8.0166 0.708397C4.9916 0.71673 2.53327 3.16673 2.53327 6.19173V7.74173C2.53327 8.14173 2.34993 8.80006 2.14993 9.14173L1.20827 10.7084C0.849935 11.3167 0.766602 12.0084 0.991602 12.6084C1.2166 13.2167 1.72493 13.7001 2.3916 13.9167C3.2916 14.2167 4.19993 14.4334 5.12493 14.5917C5.2166 14.6084 5.30827 14.6167 5.39993 14.6334C5.5166 14.6501 5.6416 14.6667 5.7666 14.6834C5.98327 14.7167 6.19993 14.7417 6.42493 14.7584C6.94993 14.8084 7.48327 14.8334 8.0166 14.8334C8.5416 14.8334 9.0666 14.8084 9.58327 14.7584C9.77493 14.7417 9.9666 14.7251 10.1499 14.7001C10.2999 14.6834 10.4499 14.6667 10.5999 14.6417C10.6916 14.6334 10.7833 14.6167 10.8749 14.6001C11.8083 14.4501 12.7333 14.2167 13.6333 13.9167C14.2749 13.7001 14.7666 13.2167 14.9999 12.6001C15.2333 11.9751 15.1666 11.2917 14.8249 10.7167ZM8.62494 7.3334C8.62494 7.6834 8.3416 7.96673 7.9916 7.96673C7.6416 7.96673 7.35827 7.6834 7.35827 7.3334V4.75006C7.35827 4.40006 7.6416 4.11673 7.9916 4.11673C8.3416 4.11673 8.62494 4.40006 8.62494 4.75006V7.3334Z"
              fill="#959CA5"
            />
          </svg>
        </button>
        <div className="border h-[36px] relative aspect-square border-[#CBD5E1] rounded-full flex items-center justify-center overflow-hidden">
          <Image
            src={"/avatar.jpg"}
            fill
            alt={"Avatar"}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardTop;
