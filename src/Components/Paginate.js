import React from 'react';
import ReactPaginate from 'react-paginate';

export function Paginate({paigeCount,currentPaige,handlePageClick}) {
  return (
    <ReactPaginate 
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={paigeCount}//  количество цифр пагинации
        marginPagesDisplayed={2}//количество пагинаций в боте (49 и 50)
        pageRangeDisplayed={2}//количество пагинаций в топе (начинается с 1 т.е при 2 покажет 1 2 3 пагинации)
        onPageChange={handlePageClick}//функция которая содержит информацию data.selected - объект указывающий порядковый номер пагинации (цифра 1 = 0 и тд цифра 100 = 99)
        containerClassName={'pagination'}
        subContainerClassName={'pages pagination'}
        activeClassName={'active'}
        forcePage={currentPaige}//текущая страница по умолчанию 0
        previousLinkClassName={"previous_page"}
        disabledClassName="disabled"
    />
  );
}

export default Paginate;