import classnames from "classnames";

export default function Pagination({
  page = 1,
  lastPage = 1,
  limit = 10,
  handlePage,
}) {
  return (
    <>
      <div className="pagination_Box">
        {page > 1 ? (
          <img
            src="/imgs/icon-arrow-left-s.png"
            onClick={() => handlePage(page - 1)}
          />
        ) : (
          <span></span>
        )}
        {Array.from(
          { length: lastPage },
          (_, i) => i + 1 + Math.floor(page / lastPage / limit) * limit
        ).map((v) => (
          <div
            key={v}
            className={classnames({
              page_item: true,
              active: v === Number(page),
            })}
            onClick={() => handlePage(v)}
          >
            <p>{v}</p>
          </div>
        ))}
        {page < lastPage ? (
          <img
            src="/imgs/icon-arrow-right-s.png"
            onClick={() => handlePage(page + 1)}
          />
        ) : (
          <span></span>
        )}
      </div>
      <style jsx>{`
        img {
          cursor: pointer;
        }
        span {
          width: 24px;
          height: 24px;
        }
        .page_item {
          margin: 0px 1px;
        }
        .page_item.active {
          background-color: var(--teal100);
        }
      `}</style>
    </>
  );
}
