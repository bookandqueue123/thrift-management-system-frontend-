import React, { ReactElement } from "react";
import Image from "next/image";

export const DashboardCard = ({
  illustrationName,
  topValue,
  bottomValueTopText,
  bottomValueBottomText,
}: {
  illustrationName: string;
  topValue: ReactElement;
  bottomValueTopText: string;
  bottomValueBottomText: string;
}) => {
  return (
    <div className="flex items-center justify-between rounded-[20px] bg-[rgba(255,255,255,0.1)] pl-5">
      <div className="space-y-6">
        {topValue}
        <div className="">
          <p className="text-xs font-semibold text-ajo_offWhite">
            {bottomValueTopText}
          </p>
          <p className="text-3xl font-extrabold text-white">
            {bottomValueBottomText}
          </p>
        </div>
      </div>
      <Image
        src={`/${illustrationName}.svg`}
        alt="stars"
        width={150}
        height={145}
        className=""
      />
    </div>
  );
};
