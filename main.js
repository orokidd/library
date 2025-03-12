const myLibrary = [
    {
        title: 'arasaka',
        author: 'hudaa',
        pages: 246,
        read: false
    },

    {
        title: 'we fear God',
        author: 'hudaa',
        pages: 265,
        read: true
    }
];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function() {
      return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}`;
    }
  }
  
function addBookToLibrary(title, author, pages, read) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
}   

function displayBook() {
    const bookContainer = document.querySelector('.books-container');
    myLibrary.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <h2>${book.title}</h2>
            <p>${book.author}</p>
            <p>${book.pages}</p>
            <p>${book.read ? 'read' : 'not read yet'}</p>
        `;
        bookContainer.appendChild(bookCard);
    });
}


addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 218, true);
displayBook();

//   const book1 = new Book('On Earth Were Briefly Gorgeous', 'Ocean Vuong', 256, true);
//   console.log(book1.info());