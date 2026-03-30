import { required, email, minLength, helpers } from "@vuelidate/validators";

export const createValidationRules = (t: (key: string, params?: unknown) => string) => {
  return {
    required: helpers.withMessage(() => t("validation.required"), required),
    email: helpers.withMessage(() => t("validation.email"), email),
    minLength: (min: number) =>
      helpers.withMessage(({ $params }) => t("validation.minLength", { min: $params.min }), minLength(min)),
    hasUpperCase: helpers.withMessage(
      () => t("validation.hasUpperCase"),
      (value: string) => /[A-Z]/.test(value),
    ),
    hasNumber: helpers.withMessage(
      () => t("validation.hasNumber"),
      (value: string) => /\d/.test(value),
    ),
    requiredTrimmed: helpers.withMessage(
      () => t("validation.requiredTrimmed"),
      (value: string) => {
        if (typeof value === "string") {
          return value.trim().length > 0;
        }
        return !!value;
      },
    ),
  };
};

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
