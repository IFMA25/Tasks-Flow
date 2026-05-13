export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  return string
    .replace(/[_-]/g, " ")
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
