import dayjs from "dayjs";

export const normalizeDate = (input) => {
  let parsed;

  if (input.includes("/")) {
    const [d, m, y] = input.split("/");
    parsed = dayjs(`${y}-${m}-${d}`);
  } else {
    parsed = dayjs(input);
  }

  if (!parsed.isValid()) return null;

  return parsed.format("YYYY-MM-DD");
};
