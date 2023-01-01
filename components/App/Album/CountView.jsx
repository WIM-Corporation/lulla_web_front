/* Refactoring*/

export default function CountView({current, total}){
    return(
        <div className="view_count">
          <p className="count_num">
             <span className="now_count">{current}</span>/<span className="max_count">{total}</span>
          </p>
        </div>
    );

}