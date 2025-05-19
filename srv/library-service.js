const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { Borrowings, Books, Students } = this.entities;

  this.on('borrowBook', async req => {
    const { bookID, studentID } = req.data;

    const book = await SELECT.one.from(Books).where({ ID: bookID });
    if (!book || book.stock <= 0) return req.error(400, 'Libro no disponible');

    await INSERT.into(Borrowings).entries({
      ID: cds.utils.uuid(),
      book_ID: bookID,
      student_ID: studentID,
      borrowedAt: new Date().toISOString(),
      returned: false
    });

    await UPDATE(Books).set({ stock: book.stock - 1 }).where({ ID: bookID });

    return 'Libro prestado correctamente.';
  });

  this.on('returnBook', async req => {
    const { borrowingID } = req.data;

    const borrowing = await SELECT.one.from(Borrowings).where({ ID: borrowingID });
    if (!borrowing || borrowing.returned) return req.error(400, 'Ya fue devuelto o no existe');

    await UPDATE(Borrowings).set({ returned: true }).where({ ID: borrowingID });
    await UPDATE(Books).set('stock = stock + 1').where({ ID: borrowing.book_ID });

    return 'Libro devuelto correctamente.';
  });

  this.on('activateStudent', async req => {
    const { studentID } = req.data;
    await UPDATE(Students).set({ active: true }).where({ ID: studentID });
    return 'Estudiante activado.';
  });

  this.on('countBorrowedBooks', async req => {
    const { studentID } = req.data;
    const result = await SELECT.from(Borrowings).where({
      student_ID: studentID,
      returned: false
    });
    return result.length;
  });
});
