class Book {
  constructor(title, author, pages, read, url) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
    this.url = url
  }

  showBookInfo() {
    return `<h2>${this.title}</h2><p>${this.author}</p><p>${this.pages} pages</p>`;
  }

  changeReadStatus() {
    this.read = !this.read;
  }
}

const iconPaths = {
  bookUnread: './assets/icons/book-off.svg',
  bookRead: './assets/icons/book-check.svg',
  bookDelete: './assets/icons/delete.svg'
};

const rawLibrary = JSON.parse(localStorage.getItem("library")) || [];
const myLibrary = rawLibrary.map(book => new Book(book.title, book.author, book.pages, book.read, book.url)); // localStorage saves only plain objects, not the Book instances. So their prototype methods like showBookInfo() and changeReadStatus() are missing.

function saveToLocalStorage() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
}

function addBookToLibrary(title, author, pages, read, url) {
    const book = new Book(title, author, pages, read, url);
    myLibrary.push(book);
    saveToLocalStorage()
}   

function refreshDisplay() {
    const bookContainer = document.querySelector('.books-container');
    bookContainer.innerHTML = '';
    myLibrary.forEach(book => {
        const deleteButton = document.createElement('button');
        const deleteIcon = document.createElement('img')
        const readButton = document.createElement('button');
        const readIcon = document.createElement('img')
        const readText = document.createElement('p')
        const bookCard = document.createElement('div');
        const infoContainer = document.createElement('div')
        const bookCover = document.createElement("img");
        const infoText = document.createElement("div")
        const infoButtons = document.createElement("div")

        bookCard.classList.add('book-card');
        infoContainer.classList.add('book-info')
        infoButtons.classList.add('info-buttons')
        infoText.classList.add('info-text')
        readButton.classList.add('read-button')
        deleteButton.classList.add('delete-button')
        bookCover.classList.add('cover-image')
        if (book.read) {
        readButton.classList.add('read');
        }

        infoText.innerHTML = `
            ${book.showBookInfo()}
        `;
        
        readIcon.setAttribute("src", book.read ? iconPaths.bookRead : iconPaths.bookUnread)
        deleteIcon.setAttribute("src", iconPaths.bookDelete);
        bookCover.setAttribute("src", book.url);
        readText.textContent = `${book.read ? 'Read' : 'Not read'}`
        
        readButton.append(readIcon, readText)
        deleteButton.appendChild(deleteIcon)
        infoButtons.append(readButton, deleteButton)
        infoContainer.append(infoText, infoButtons)
        bookCard.append(infoContainer, bookCover);
        bookContainer.appendChild(bookCard);

        deleteButton.addEventListener('click', (event) => {
            handleDeleteButton(event, book)
    });
        readButton.addEventListener('click', (event) => {
            handleReadButton(event, book)
    });
    });
}

function handleDeleteButton(event, book) {
    deleteBook(book);
    const btn = event.currentTarget;
    const card = btn.closest('.book-card');
  
  if (card) {
    card.remove();
  }
}

function handleReadButton(event, book) {
    readBook(book);
    const btn = event.currentTarget;
    const btnIcon = btn.querySelector('img')
    const btnText = btn.querySelector('p')

    btn.classList.toggle("read");
    btnIcon.setAttribute("src", book.read ? iconPaths.bookRead : iconPaths.bookUnread)
    btnText.textContent = `${book.read ? 'Read' : 'Not read'}`
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
        const url = form.cover.value || './assets/bg/blank.jpg';

        if (title && author && pages) {
            addBookToLibrary(title, author, pages, read, url);
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
    addBookToLibrary('1984', 'George Orwell', 328, false, "https://cdn2.penguin.com.au/covers/original/9781784878979.jpg");
    addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 218, true, "https://i.pinimg.com/474x/15/84/9f/15849fc30c787f0b8308bc0273b9591e.jpg");
    addBookToLibrary('The Catcher in the Rye', 'J.D. Salinger', 234, false, "https://m.media-amazon.com/images/I/8125BDk3l9L.jpg");
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
