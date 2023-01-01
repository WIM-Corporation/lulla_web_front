import {useState, useEffect} from "react";

export default function useLoading(
  initialStatus,
  {onLoading, onSuccess, onError, onReset, initialError, initialMsg} = {}
) {
  const [status, setStatus] = useState(initialStatus ?? "initial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? false);
  const [message, setMessage] = useState(initialMsg ?? "");

  const handleStatus = (status) => {
    setStatus(status);
  };

  const handleError = (newError) => {
    setError({...error, ...newError});
  };

  const handleMessage = (msg) => {
    setMessage(msg);
  };

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      if (!initialError) setError(false);
      if (onLoading) onLoading();
    } else if (status === "success") {
      setLoading(false);
      if (!initialError) setError(false);
      if (onSuccess) onSuccess();
    } else if (status === "error") {
      setLoading(false);
      if (!initialError) setError(true);
      if (onError) onError();
    } else if (status === "initial") {
      // state를 초기로 바꿀 때 혹은 state 내부 Object 객체 일부분만을 초기화 할 때 실행
      setLoading(false);
      if (!initialError) setError(false);
      if (onReset) onReset();
    }
  }, [status]);

  useEffect(() => {
    // mount시에만 실행 => 완전 초기화
    setStatus(initialStatus ?? "initial");
    setLoading(false);
    setError(initialError ?? false);
    setMessage(initialMsg ?? "");
  }, []);

  return {
    status,
    handleStatus,
    loading,
    error,
    handleError,
    message,
    handleMessage,
  };
}
