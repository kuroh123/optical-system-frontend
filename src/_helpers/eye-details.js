const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export const spherical = arrayRange(-18.0, 6.0, 0.25).reverse();
export const cylindrical = arrayRange(-7, 7, 0.25).reverse();
export const axis = arrayRange(1, 180, 1);
export const gender = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "other", label: "Other" },
];

export const frame_types = [
  { value: "Full-rimmed", label: "Full-rimmed" },
  { value: "Semi-rimless", label: "Semi-rimless" },
  { value: "Rimless", label: "Rimless" },
  { value: "Sun-Glasses", label: "Sun-Glasses" },
  { value: "Supra", label: "Supra" },
  { value: "Low-Bridge", label: "Low-Bridge" },
  { value: "Wire", label: "Wire" },
];

export const lens_types = [
  { value: "Single-vision", label: "Single-vision" },
  { value: "Bifocal", label: "Bifocal" },
  { value: "Trifocal", label: "Trifocal" },
  { value: "Progressive", label: "Progressive" },
  { value: "Contact-lens", label: "Contact-lens" },
  { value: "Toric", label: "Toric" },
  { value: "Prism", label: "Prism" },
];

export const lens_for = [
  { value: "Distance", label: "Distance" },
  { value: "Near", label: "Near" },
  { value: "BiFocal", label: "BiFocal" },
];

export const lens_side = [
  { value: "Right", label: "Right" },
  { value: "Left", label: "Left" },
  { value: "Both", label: "Both" },
];

export const other_items = [
  { value: "Lens-Solution", label: "Lens-Solution" },
  { value: "Eye-Drops", label: "Eye-Drops" },
];

export const status = [
  { value: "pending", label: "pending" },
  { value: "partially_paid", label: "Partially Paid" },
  { value: "paid", label: "Paid" },
];
