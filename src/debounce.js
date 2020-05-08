export const debounce = (fn, trashold) => {
  let isCd = false;
  let savedArgs = null;

  return (...args) => {
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

        setTimeout(() => (isCd = false), trashold);
      } else {
        isCd = false;
      }
    }, trashold);
  };
};
