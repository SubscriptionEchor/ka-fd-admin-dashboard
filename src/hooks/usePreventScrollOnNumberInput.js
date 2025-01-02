import { useEffect } from 'react';

const usePreventScrollOnNumberInput = (inputRef) => {
  useEffect(() => {
    const handleWheel = (event) => {
      if (document.activeElement === inputRef.current) {
        event.preventDefault();
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [inputRef]);
};

export default usePreventScrollOnNumberInput;