let myLibrary = [];
const library = document.getElementById("library")

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function () {
    this.read = !this.read;
    updateBookList();
}

function addToLibrary(title = "Not specified", author = "Not specified", pages = "Not specified", read = false) {
    const book = new Book(title, author, pages, read);
    myLibrary.push(book);
    updateBookList();
}

function updateBookList() {
    clearLibrary();
    for (book of myLibrary) {
        book.createBookCard();
    }
    updateListeners();
    localStorage.setItem("library", JSON.stringify(myLibrary));
}

Book.prototype.createBookCard = function () {
    const bookHolder = document.createElement("div");
    bookHolder.id = "bookHolder"
    bookHolder.setAttribute("data-libLocation", myLibrary.indexOf(this))
    const bookElement = document.createElement("div");
    //title
    const title = document.createElement("h2")
    title.textContent = this.title
    bookElement.appendChild(title)
    //author
    const author = document.createElement("h3")
    author.textContent = "By: " + this.author
    bookElement.appendChild(author)
    //pages
    const pages = document.createElement("p")
    pages.textContent = "Pages: " + this.pages
    bookElement.appendChild(pages)
    //read status
    const read = document.createElement("p")
    read.textContent = this.read ? "Finished reading." : "Not yet read."
    bookElement.appendChild(read)
    //change read status button
    const readBtn = document.createElement("button")
    readBtn.textContent = "Change read status"
    readBtn.className = "readButton"
    bookElement.appendChild(readBtn)
    //delete button
    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete book"
    deleteBtn.className = "deleteButton"
    bookElement.appendChild(deleteBtn)
    bookHolder.appendChild(bookElement);
    library.appendChild(bookHolder)
}

function clearLibrary() {
    while (library.firstChild) {
        library.firstChild.remove()
    }
}

function toggleInputDisplay() {
    const inputSection = document.getElementById("addBook");
    if (inputSection.style.display === "none") {
        inputSection.style.display = "block";
    } else {
        inputSection.style.display = "none";
    }
}

function submitBook() {
    const bookInput = document.getElementById("newBook").elements
    const [title, author, pages, read] = [bookInput[0].value, bookInput[1].value,
    bookInput[2].value, bookInput[3].checked];
    if (title.length > 0 && author.length > 0 && pages.length > 0) {
        addToLibrary(title, author, pages, read)
        toggleInputDisplay()
    } else {
        alert("Please enter all values.")
    }
}


function updateListeners() {
    handleReadButtons();
    handleDeleteButtons();
}

function handleReadButtons() {
    const readButtons = Array.from(document.getElementsByClassName("readButton"));
    readButtons.forEach(key => key.addEventListener("click", function (e) {
        bookIndex = e.path[2].dataset.liblocation;
        myLibrary[bookIndex].toggleRead();
    }))
}

function handleDeleteButtons() {
    const deleteButtons = Array.from(document.getElementsByClassName("deleteButton"));
    deleteButtons.forEach(key => key.addEventListener("click", function (e) {
        bookIndex = e.path[2].dataset.liblocation;
        myLibrary.splice(bookIndex, 1);
        updateBookList();
    }))
}

if (!localStorage.getItem('library')) {
    //add some books to populate screen
    localStorage.setItem("library", []);
    addToLibrary("The Power of Habit", "Charles Duhigg", 371, true);
    addToLibrary("Extreme Ownership", "Jocko Willink and Leif Babin", 384, false);
} else {
    let storedLibrary = JSON.parse(localStorage.getItem("library") || "[]");
    storedLibrary.forEach(book => {
        addToLibrary(book.title, book.author, book.pages, book.read);
    })
}

