import React from "react";
import dayjs, { Dayjs } from "dayjs";

export function useShortDate(date: string, now: Dayjs) {
  return React.useMemo(() => {
    const d = dayjs(date);
    if (now.isSame(d, "day")) {
      return d.format("HH:mm");
    } else if (now.isSame(d, "year")) {
      return d.format("MM.DD");
    } else {
      return d.format("YY.MM.DD");
    }
  }, [date, now]);
}
