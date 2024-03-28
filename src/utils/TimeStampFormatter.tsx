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

export function extractTime(dateString: string | Date): string {
  console.log(dateString);

  // Create a Date object from the provided dateString
  const date = new Date(dateString);

  // Extract hours, minutes, and seconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the time string with leading zeros where necessary
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

  // Return the formatted time string
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}
