const { nanoid } = require('nanoid')
const book = require('./book')

exports.addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload

    const id = nanoid(16)
    const finished = pageCount === readPage
    const insertedAt = new Date().toString()
    const updatedAt = insertedAt

    const newBook = {name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt}

    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku, isi nama terlebih dahulu'
        })
    }
    else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount"
        })
    }

    book.push(newBook)
    const isSuccess = book.filter((books) => books.id === id.length > 0)

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            }
        })
            .code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal di tambaahkan',
    })
    response.code(500);
    return response;
}

exports.getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = book;

    if (name) {
        const nameRegex = new RegExp(name, 'gi');
        filteredBooks = filteredBooks.filter((book) => nameRegex.test(book.name));
    }

    if (reading) {
        filteredBooks = filteredBooks.filter((book) => Number(book.reading) === Number(reading));
    }

    if (finished) {
        filteredBooks = filteredBooks.filter((book) => Number(book.finished) === Number(finished));
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    }).code(200);

    return response;
};

exports.getDetailBookByIdHandler = (request, h) => {
    const bookId = request.params
    const filteredBooks = book.filter((books) => book.id === bookId)[0]

    if( filteredBooks !== undefined){
        const response = h.response({
            status: "success",
            data: {
                filteredBooks
            }
        }).code(200)
        return response
    }

    const response = h.response({
        status: "fail",
        message: "Buku tidak ditemukan"
    }).code(404)
    return response
}