    export const calculateYears = (date1: Date | string, date2: Date | string): number => {
      if (typeof date1 === "string") date1 = new Date(date1);
      if (typeof date2 === "string") date2 = new Date(date2);
      const differenceInMilliseconds = Math.abs(date2.getTime() - date1.getTime());
      const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25; // Incluyendo años bisiestos
      return Math.floor(differenceInMilliseconds / millisecondsPerYear);
    };