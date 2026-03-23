import { computed, toValue, type MaybeRefOrGetter } from "vue";

export function useSelectedOption<T extends {key: string}>(
  options: MaybeRefOrGetter<T[]>,
  activeValue: MaybeRefOrGetter<string>,
  onSelect: (value: string, option: T) => void,
) {
  return computed({
    get: () => {
      const opts = toValue(options);
      const active = toValue(activeValue);
      return opts.find((option) => option.key === active) || opts[0];
    },
    set: (option: T) => {
      onSelect(option.key, option);
    },
  });
}
