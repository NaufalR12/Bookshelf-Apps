document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  let editedBookId = null;

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (editedBookId === null) {
      addBook();
    } else {
      editBook();
    }
  });

  searchBookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  function getBooksFromStorage() {
    const storedBooks = JSON.parse(localStorage.getItem("books")) || [];
    return storedBooks;
  }

  function saveBooksToStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  function displayBooks(booksToShow) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    booksToShow.forEach((book) => {
      const listItem = document.createElement("article");
      listItem.classList.add("book_item");
      listItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="${book.isComplete ? "green" : "red"}" data-id="${
        book.id
      }">
            ${book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca"}
          </button>
          <button class="blue edit-btn" data-id="${book.id}">Edit</button>
          <button class="red delete-btn" data-id="${
            book.id
          }">Hapus buku</button>
        </div>
      `;

      const toggleButton = listItem.querySelector(".action button:first-child");
      toggleButton.addEventListener("click", function () {
        toggleBookStatus(book.id);
        displayBooks(getBooksFromStorage());
      });

      const editButton = listItem.querySelector(".action button.edit-btn");
      editButton.addEventListener("click", function () {
        editedBookId = book.id;
        fillEditForm(book);
      });

      const deleteButton = listItem.querySelector(".action button.delete-btn");
      deleteButton.addEventListener("click", function () {
        deleteBook(book.id);
        displayBooks(getBooksFromStorage());
      });

      if (book.isComplete) {
        completeBookshelfList.appendChild(listItem);
      } else {
        incompleteBookshelfList.appendChild(listItem);
      }
    });
  }

  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    if (title && author && !isNaN(year)) {
      const books = getBooksFromStorage();
      const newBook = {
        id: +new Date(),
        title,
        author,
        year,
        isComplete,
      };

      books.push(newBook);
      saveBooksToStorage(books);
      displayBooks(getBooksFromStorage());

      inputBookForm.reset();
      editedBookId = null;
    } else {
      alert("Mohon lengkapi semua field sebelum menambahkan buku.");
    }
  }

  function fillEditForm(book) {
    document.getElementById("inputBookTitle").value = book.title;
    document.getElementById("inputBookAuthor").value = book.author;
    document.getElementById("inputBookYear").value = book.year;
    document.getElementById("inputBookIsComplete").checked = book.isComplete;
  }

  function editBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    if (title && author && !isNaN(year)) {
      const books = getBooksFromStorage();
      const editedBookIndex = books.findIndex(
        (book) => book.id === editedBookId
      );

      if (editedBookIndex !== -1) {
        books[editedBookIndex].title = title;
        books[editedBookIndex].author = author;
        books[editedBookIndex].year = year;
        books[editedBookIndex].isComplete = isComplete;

        saveBooksToStorage(books);
        displayBooks(getBooksFromStorage());

        inputBookForm.reset();
        editedBookId = null;
      } else {
        alert("Buku yang akan diedit tidak ditemukan.");
      }
    } else {
      alert("Mohon lengkapi semua field sebelum mengedit buku.");
    }
  }

  function toggleBookStatus(id) {
    const books = getBooksFromStorage();
    const bookIndex = books.findIndex((book) => book.id === id);
    books[bookIndex].isComplete = !books[bookIndex].isComplete;
    saveBooksToStorage(books);
  }

  function deleteBook(id) {
    const books = getBooksFromStorage();
    const updatedBooks = books.filter((book) => book.id !== id);
    saveBooksToStorage(updatedBooks);
  }

  function searchBook() {
    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const books = getBooksFromStorage();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );
    displayBooks(filteredBooks);
  }

  displayBooks(getBooksFromStorage());
});
