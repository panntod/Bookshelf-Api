const {
  addBookHandler,
  deleteBookByIdHandler,
  editItemByIdHandler,
  getAllBookHandler,
  getDetailBookByIdHandler,
} = require("./handler");

const routes =[
    {
        method: "POST",
        path: "/books",
        handler: addBookHandler
    },
    {
        method: "GET",
        path: "/books",
        handler: getAllBookHandler
    },
    {
        method: "GET",
        path: "/books/{bookId}",
        handler: getDetailBookByIdHandler
    },
    {
        method: "PUT",
        path: "/books/{bookId}",
        handler: editItemByIdHandler
    },
    {
        method: "DELETE",
        path: "/books/{bookId}",
        handler: deleteBookByIdHandler
    },
]