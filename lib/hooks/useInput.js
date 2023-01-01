import { useState, useEffect } from "react";

export default function useInput(
  initialState,
  { onChangeCondition, cb, dependencies = [], initialError } = {}
) {
  const [inputs, setInputs] = useState(initialState || {});
  const [error, setError] = useState(initialError || initialState || {});
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setError(initialError || initialState || {});
    if (onChangeCondition) {
      const result = onChangeCondition(name, value);
      if (result !== false) setInputs({ ...inputs, [name]: result });
    } else
      setInputs({
        ...inputs,
        [name]: type === "checkbox" ? !inputs[name] : value,
      });
    if (cb) cb({ name, value });
  };

  const reset = () => {
    setInputs(initialState);
    setError(initialState);
  };

  useEffect(() => {
    setInputs(initialState);
  }, [...dependencies]);

  return { inputs, setInputs, handleChange, reset, error, setError };
}
