import dayjs from "dayjs";

export const isRecentlyUpdated = (() => {
  const lastDay = dayjs(process.env.NEXT_PUBLIC_UPDATE_TIMESTAMP);
  const now = dayjs();
  const d = now.diff(lastDay, "day");
  if (d <= 7) {
    return true;
  } else {
    return false;
  }
})();
