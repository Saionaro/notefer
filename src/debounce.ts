export const debounce = (fn: Function, threshold: number): Function => {
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
