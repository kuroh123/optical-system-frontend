const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );

export const spherical = arrayRange(-18.0, 6.0, 0.25).reverse();
export const cylindrical = arrayRange(-7, -0.25, 0.25).reverse();
export const axis = arrayRange(1, 180, 1);
