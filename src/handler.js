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
        }).code(400)
        return response;
    }
    else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount"
        }).code(400)
        return response;
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
        }).code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal di tambaahkan',
    }).code(500);
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

exports.editItemByIdHandler = (request, h) => {
    const bookId = request.params
    const { name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload

    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku, isi nama terlebih dahulu'
        }).code(400)
        return response;
    }
    else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: "Gagal menambahkan buku, readPage tidak boleh lebih besar dari pageCount"
        }).code(400)
        return response;
    }

    const finished = pageCount === readPage
    const updatedAt = new DataTransfer().toString()

    const index = book.findIndex((books) => books.id === bookId)

    if(index !== -1){
        book[index] = {
            ...items[index], name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }).code(200);
        return response;
    }

    const response = h
    .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
    return response;
}

exports.deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params; const index = book.findIndex((book) => book.id === bookId);
    if (index > -1) {
        book.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        }).code(200);
        return response;
    }


    // Jika id book tidak ada  
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
    return response;
}