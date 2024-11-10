const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const timestamp = new Date().toISOString();

  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt: timestamp, updatedAt: timestamp };
  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  }).code(201);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBooks = books;

  if (name) filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  if (reading) filteredBooks = filteredBooks.filter((book) => book.reading === (reading === '1'));
  if (finished) filteredBooks = filteredBooks.filter((book) => book.finished === (finished === '1'));

  const responseBooks = filteredBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return h.response({
    status: 'success',
    data: { books: responseBooks },
  }).code(200);
};

const getBookByIdHandler = (request, h) => {
  const book = books.find((b) => b.id === request.params.bookId);
  if (!book) {
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  }

  return h.response({
    status: 'success',
    data: { book },
  }).code(200);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const index = books.findIndex((b) => b.id === bookId);
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  books[index] = {
    ...books[index],
    name, year, author, summary, publisher, pageCount, readPage, reading,
    updatedAt: new Date().toISOString(),
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookByIdHandler = (request, h) => {
  const index = books.findIndex((b) => b.id === request.params.bookId);
  if (index === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(index, 1);
  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
