// [Reference] https://stackoverflow.com/questions/32553158/detect-click-outside-react-component
import { useState, useRef, useEffect } from "react";

export const useOpen = (tagName, outsideRestrict = false, cb = () => {}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (e) => {
    if (!outsideRestrict) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        cb();
      }
    }
  };

  useEffect(() => {
    if (window) {
      ref.current = document.createElement(tagName);
      document.addEventListener("click", handleClickOutside, true);
    }
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  return { ref, open, setOpen };
};
