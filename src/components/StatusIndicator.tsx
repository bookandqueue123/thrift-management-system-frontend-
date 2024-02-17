"use client";

export const StatusIndicator = ({ label }: { label: string }) => {
  const getIndicatorStyles = (label: string) => {
    switch (label.toLowerCase()) {
      case "pending":
        return {
          bgClass: "bg-pendingBg",
          textClass: "text-pendingText",
          btn: "",
        };
      case "success":
        return {
          bgClass: "bg-successBg",
          textClass: "text-successText",
          btn: "",
        };
      case "failed":
        return {
          bgClass: "bg-failedBg",
          textClass: "text-errorText",
          btn: "",
        };
      default:
        return {
          bgClass: "bg-pendingBg",
          textClass: "text-ajo_offWhite",
          btn: "cursor-pointer hover:border-ajo_blue hover:border focus:border-ajo_blue focus:border",
        };
    }
  };

  const { bgClass, textClass, btn } = getIndicatorStyles(label);
  return (
    <div className={`${bgClass} rounded-lg px-3 py-2`}>
      <p
        className={`text-sm font-medium ${textClass} text-center capitalize ${btn}`}
        onClick={
          label !== "success" && label !== "failed" && label !== "pending"
            ? () => {}
            : () => {}
        }
      >
        {label}
      </p>
    </div>
  );
};
