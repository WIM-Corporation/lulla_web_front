import { useState, useMemo } from "react";

export default function usePagination({ initialPage, totalCount, limit, cb }) {
  const [page, setPage] = useState(initialPage);
  const lastPage = useMemo(
    () => Math.ceil(totalCount / limit),
    [totalCount, limit]
  );

  const handlePage = (nextPage) => {
    if (nextPage <= 0 || nextPage > lastPage || totalCount === 0) return;
    setPage(nextPage);
    if (cb && typeof cb === "function") cb(nextPage);
  };

  return { page, lastPage, handlePage };
}
