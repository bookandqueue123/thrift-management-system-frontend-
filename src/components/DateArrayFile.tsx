
interface DateRangeComponentProps{
    startDateString: Date | string,
     endDateString: Date | string
}
const DateRangeComponent = ({ startDateString, endDateString }: DateRangeComponentProps) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  const datesInBetween = [];

  // Loop through each date between start and end dates
  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    datesInBetween.push(new Date(currentDate));
  }

  // Format dates back into string if needed
  const formattedDatesInBetween = datesInBetween.map(date => date.toISOString().split('T')[0]);

  return formattedDatesInBetween;
}

export default DateRangeComponent;
