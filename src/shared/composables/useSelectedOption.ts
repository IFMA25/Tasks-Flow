import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useSelectedOption<T>(
  options: MaybeRefOrGetter<T[]>,
  activeValue: MaybeRefOrGetter<T[keyof T]>,
  onSelect: (value: T[keyof T], option: T) => void,
  key: keyof T,
) {
  return computed({
    get: () => {
      const opts = toValue(options);
      const active = toValue(activeValue);
      return opts.find((opt) => opt[key] === active) || opts[0];
    },
    set: (option: T) => {
      onSelect(option[key], option);
    },
  });
}
