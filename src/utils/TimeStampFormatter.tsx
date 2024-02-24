export const formatToDateAndTime = (
  timestamp: string,
  type?: "date" | "time" | "both",
) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");

  if (type === "date") {
    return `${formattedMonth}/${formattedDay}/${year}`
  } else if (type === 'time') {
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  } else {
    `${formattedMonth}/${formattedDay}/${year}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

};
