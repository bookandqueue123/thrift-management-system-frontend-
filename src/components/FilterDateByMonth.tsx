export const filterDatesByMonth = (dates: any[], targetMonth: number) => {
    return dates.filter(dateStr => {
      const date = new Date(dateStr);
      return date.getMonth() + 1 === targetMonth; // getMonth() returns zero-based month index
    });
  }

