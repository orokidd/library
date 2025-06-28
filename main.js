class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
  }

  showBookInfo() {
    return `<h2>${this.title}</h2><p>${this.author}</p><p>${this.pages} pages</p>
      <p>${this.read ? 'Read' : 'Not read'}</p>`;
  }

  changeReadStatus() {
    this.read = !this.read;
  }
}

const rawLibrary = JSON.parse(localStorage.getItem("library")) || [];
const myLibrary = rawLibrary.map(book => new Book(book.title, book.author, book.pages, book.read)); // localStorage saves only plain objects, not the Book instances. So their prototype methods like showBookInfo() and changeReadStatus() are missing.

function saveToLocalStorage() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
    saveToLocalStorage()
}   

function refreshDisplay() {
    const bookContainer = document.querySelector('.books-container');
    bookContainer.innerHTML = '';
    myLibrary.forEach(book => {
        const deleteButton = document.createElement('button');
        const readButton = document.createElement('button');
        const bookCard = document.createElement('div');

        deleteButton.textContent = 'Delete';
        readButton.textContent = 'Read';
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            ${book.showBookInfo()}
        `;

        bookCard.appendChild(deleteButton);
        bookCard.appendChild(readButton);
        bookContainer.appendChild(bookCard);

        deleteButton.addEventListener('click', () => {
            deleteBook(book)
            refreshDisplay();
    });
        readButton.addEventListener('click', () => {
            readBook(book)
            refreshDisplay();
    });
    });
}

function readBook(book) {
    book.changeReadStatus();
    saveToLocalStorage()
}

function deleteBook(book) {
    myLibrary.splice(myLibrary.indexOf(book), 1);
    saveToLocalStorage()
}

function displayNewButton() {
    const bookContainer = document.querySelector('.button-container');
    const newButton = document.createElement('button');
    newButton.classList.add('new-button');
    newButton.textContent = 'New book';
    newButton.addEventListener('click', () => {
        const dialog = document.getElementById('bookDialog');
        dialog.showModal();
    });
    bookContainer.appendChild(newButton);
}

function handleDialogForm() {
    const dialog = document.getElementById('bookDialog');
    const form = document.getElementById('bookForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = form.title.value;
        const author = form.author.value;
        const pages = parseInt(form.pages.value);
        const read = form.read.checked;

        if (title && author && pages) {
            addBookToLibrary(title, author, pages, read);
            refreshDisplay();
            dialog.close(); 
            form.reset(); 
        } else {
            alert('Invalid input. Please try again.');
        }
    });

    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        dialog.close(); 
        form.reset();
    });
}

function populateBook() {
    addBookToLibrary('1984', 'George Orwell', 328, false);
    addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 218, true);
    addBookToLibrary('The Catcher in the Rye', 'J.D. Salinger', 234, false);
}

function init() {
    if (myLibrary.length === 0) {
        populateBook();
        saveToLocalStorage()
    }
    refreshDisplay();
    displayNewButton();
    handleDialogForm();
}

init();
