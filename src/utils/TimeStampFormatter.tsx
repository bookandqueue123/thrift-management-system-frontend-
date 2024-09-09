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
    return `${formattedMonth}/${formattedDay}/${year}`;
  } else if (type === "time") {
    `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  } else {
    `${formattedMonth}/${formattedDay}/${year}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }
};

export function extractDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`;
}

export function extractTime(dateString: string | Date): string {
  // Create a Date object from the provided dateString
  const date = new Date(dateString);

  // Extract hours, minutes, and seconds
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Format the time string with leading zeros where necessary
  const formattedHours = hours < 10 ? "0" + hours : hours;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;

  // Return the formatted time string
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export function daysBetweenDates(
  startDateString: string | number | Date,
  endDateString: string | number | Date,
) {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const timeDifference = Number(endDate) - Number(startDate);
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  const dayOrDays = daysDifference === 1 ? "day" : "days";
  return `${daysDifference} ${dayOrDays}`;
}

export function daysUntilDate(futureDateString: string | number | Date) {
  const futureDate = new Date(futureDateString);
  const today = new Date();

  const timeDifference = Number(futureDate) - Number(today);
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  const dayOrDays = daysDifference === 1 ? "day" : "days";
  return `${daysDifference} ${dayOrDays}`;
}

export function DateDuration(
  endDate: string | number | Date,
  startDate: string | number | Date,
) {
  const startDateString = startDate ? new Date(startDate) : null;
  const endDateString = endDate ? new Date(endDate) : null;
  const TotalPaymentDuration =
    endDateString && startDateString
      ? (Number(endDateString) - Number(startDateString)) /
        (1000 * 60 * 60 * 24)
      : null; // in days
  return TotalPaymentDuration;
}
