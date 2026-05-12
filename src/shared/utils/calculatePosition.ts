interface CalculateDropdownPositionParams {
  rect: DOMRect;
  dropdownWidth: number;
  dropdownHeight: number;
  margin?: number;
}

export function calculatePosition({
  rect,
  dropdownWidth: w,
  dropdownHeight: h,
  margin = 8,
}: CalculateDropdownPositionParams): { top: number; left: number } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = rect.right - w / 2;
  let top = rect.bottom;

  if (left < margin) {
    left = rect.left;
  }

  if (left + w > vw - margin) {
    left = vw - w - margin;
  }

  if (top + h > vh - margin) {
    top = rect.top - h - margin;
  }

  if (top < margin) {
    top = margin;
  }

  return { top, left };
}
