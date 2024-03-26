export const formatToDateAndTime = (
  timestamp: string | Date,
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


export function extractDate(dateString: string | Date): string {
  console.log(dateString)
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
}