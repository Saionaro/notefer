type GenericFunction = (...args: unknown[]) => unknown;

export const debounce = (fn: GenericFunction, threshold: number): GenericFunction => {
  let isCd = false;
  let savedArgs: unknown[]|null = null;
  return (...args: unknown[]) => {
    if (isCd) {
      savedArgs = args;
      return;
    }

    fn(...args);

    isCd = true;

    setTimeout(() => {
      if (savedArgs) {
        fn(...savedArgs);
        savedArgs = null;

        setTimeout(() => (isCd = false), threshold);
      } else {
        isCd = false;
      }
    }, threshold);
  };
};
