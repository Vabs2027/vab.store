
const statusMap = {//статус истории заказов, а также самого заказа одиночного
       new: 'Новий',
       pending: 'Очікує оплати',
       paid: 'Оплачено',
       cancelled: 'Відхилено',
       delivered: 'Доставлено'
   };

export default statusMap;//default экспорт по умолчанию- что этот файл отдает наружу — это statusMap, одно главное значение