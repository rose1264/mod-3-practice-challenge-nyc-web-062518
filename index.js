document.addEventListener("DOMContentLoaded", function() {
// step 1: Get a list of books & render them http://localhost:3000/books
  const list = document.getElementById('list')
  const showPanel = document.getElementById('show-panel')

// initialization
  fetch('http://localhost:3000/books')
    .then(res => res.json())
    .then(data => displayBookList(data))

  const displayBookList = (data) => {
    data.forEach(book => {
      let bookLi = document.createElement('li')
      bookLi.dataset.id = book.id
      bookLi.innerText = book.title
      list.appendChild(bookLi)
      bookLi.addEventListener('click', (e)=>{
        showPanel.innerHTML = ''
        let bookDiv = document.createElement('div')
        let bookDivContent = renderBook(book)
        bookDiv.innerHTML = bookDivContent
        showPanel.appendChild(bookDiv)
        //add event listener of the like button
        let likeBtn = document.getElementById('like')
        likeBtn.addEventListener('click', (e)=> {
          //patch request to update like user
          if (likeBtn.innerText === 'Like') {
            let lastPTag = e.target.previousElementSibling
            let newPTag = document.createElement('p')
            newPTag.innerHTML = '<p id="1">rose</p>'
            lastPTag.appendChild(newPTag)
            likeBtn.innerText = 'unLike'
            likeBook(book)
          } else {
            let removePTag = document.querySelector('p[id="1"]')
            removePTag.remove()
            likeBtn.innerText = 'Like'
            unlikeBook(book)
          }
        })

      })
    })
  }

// step 2: Be able to click on a book, you should see
// 1. the book's thumbnail   2. description   3. a list of users who have liked the book.

const renderBook = (book) => {
  return `
  <h2>${book.title}</h2>
  <img src="${book.img_url}" alt="${book.title}" />
  <p>${book.description}</p>
  <p>Liked By Following Users:</p>
  ${book.users.map(user => `<p id="${user.id}">${user.username}</p>`).join('')}
  <button id='like'>Like</button>
  `
}


// step 3: You can like a book by clicking on a button.
//  - You are user 1 {"id":1, "username":"pouros"},
//  - so to like a book send a PATCH request to http://localhost:3000/books/:id with an array of users who like the book.
//  - This array should be equal to the existing array of users that like the book, plus your user.
    // For example, if the previous array was "[{"id":2, "username":"auer"}, {"id":8, "username":"goodwin"}],
    // you should send as the body of your PATCH request:
// {
//   "users": [
//     {"id":2, "username":"auer"},
//     {"id":8, "username":"goodwin"},
//     {"id":1, "username":"pouros"}
//   ]
// }
const likeBook = (book) => {
  let fetchBody = book.users.push({id:1, username:"rose"})
  fetch(`http://localhost:3000/books/${book.id}`,{
    method: 'PATCH',
    body: JSON.stringify({users: book.users}),
    headers: {
        "content-type": "application/json"
    }
  })
}

// step 4:
// BONUS: Can you make it so a second patch request to the same book removes your user from the list of users?
// Can you toggle likes on and off?
const unlikeBook = (book) => {
  fetch(`http://localhost:3000/books/${book.id}`,{
    method: 'PATCH',
    body: JSON.stringify({users: book.users}),
    headers: {
        "content-type": "application/json"
    }
  })
}
});
