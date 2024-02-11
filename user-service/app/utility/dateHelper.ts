import dayjs from "dayjs";

export const TimeDifference = (
  fromDate: string,
  toDate: string,
  type: "d" | "h" | "m"
) => {
  const start = dayjs(fromDate);
  return start.diff(dayjs(toDate), type, true);
};
