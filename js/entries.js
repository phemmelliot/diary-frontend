
const token = localStorage.getItem('token');
const loader = document.getElementById('loadDiv');
const errorHead = document.getElementById('errorHead');
const errorImage = document.getElementById('errImage')


// Get the modal
const modal = document.getElementById('myModal');
const addModal = document.getElementById('addModal');
const addClose = document.getElementById('addClose');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];


const wrapper = document.getElementById('myWrapper');


const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const editTitle = document.getElementById('editTitle');
const editText = document.getElementById('editText');

// This is for a adding a new entry

// const closeBtn = document.getElementById('closeBtn');
const addSaveBtn = document.getElementById('addSaveBtn');
const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');

const addFab = document.getElementById('addFab');

addFab.onclick = function () {
  addModal.style.display = 'block';
  addTitle.innerHTML = 'Here goes your title';
  addText.innerHTML = 'And here you can pour down your thoughts';
  addTitle.contentEditable = 'true';
  addText.contentEditable = 'true';
  setTimeout(titleClick, 1);
};

function titleClick(){
  addTitle.focus();
  addTitle.style.cursor = 'pointer';
  // addTitle.onclick = removePlaceHolder;
  // addText.onclick = removeTextPlaceHolder;
}

// function removePlaceHolder(){
//   addTitle.innerHTML = '';
// }
//
// function removeTextPlaceHolder(){
//   addText.innerHTML = '';
// }

closeBtn.onclick = function () {
  addModal.style.display = 'none';
};


addClose.onclick = function () {
  addModal.style.display = 'none';
};


function handleResponse(response) {
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
  return response.json()
    .then(json => {
      if (response.ok) {
        return json
      } else {
        let error = Object.assign({}, json, {
           status: response.status,
           statusText: response.statusText
             })
        return Promise.reject(error)
      }
    })
}

window.onload = function onload(){
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
  fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/entries', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
    })
    .then(handleResponse)
    .then(result => loadEntries(result))
    .catch(error => checkErrors(error))
 }
 let entries;
function loadEntries(result){
  loader.classList.remove('loader');
  loader.classList.add('loaderNone');
    let entry = '';
    let index = 0;
    entries = result.data.entries;
    entries.forEach(function(entries){
      entry += `
      <div class="inner-box" id="${index}">
        <h1 id="${index}">${entries.title}</h1>
        <p id="${index}">${entries.description}</p>
        <p class="errorHeaderNone" id="${index}">${index}</p>
      </div>
      `;
      index+=1;
    });
    wrapper.innerHTML = entry;
}


// const emptyDiary = document.getElementById('emptyDiary');
function checkErrors(error){
  // console.log(error);
  if (error.message === 'Internal Server Error'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorImage.classList.remove('errorImageNone');
    errorImage.classList.add('errorImage');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please reload<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if(error.message === 'There is no entries yet') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    emptyDiary.classList.remove('loaderNone');
    emptyDiary.classList.add('noEntry');
    document.getElementById('entriesBody').classList.add('errorImage');
  } else if(error.message === 'Auth failed') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorImage.classList.remove('errorImageNone');
    errorImage.classList.add('errorImage');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
    window.location.replace('login.html');
    // console.log('A error occured, please try again');
  }

  errorClose.onclick = function(){
    errorHead.classList.remove('errorHeader');
    errorHead.classList.add('errorHeaderNone');
  }
}



// Handles Creation of an entry

addSaveBtn.onclick = function saveEntry(){
  addModal.style.display = 'none';
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
  gradientBg.classList.remove('loaderNone');
  gradientBg.classList.add('gradient');
  emptyDiary.classList.remove('noEntry');
  emptyDiary.classList.add('loaderNone');
  const title = addTitle.textContent;
  const text = addText.textContent;

  postEntry(title, text);
}

function postEntry(title, text){
  fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/entries', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'mode':'no-cors',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, text }),
    })
    .then(handleResponse)
    .then(data => successPost(data))
    .catch(error => erroredPost(error))
}

function successPost(data){
  gradientBg.classList.remove('gradient');
  gradientBg.classList.add('loaderNone');
  loadEntries(data);
}

function erroredPost(error){
  if (error.message === 'Bad Request'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Your entry must have a title and body<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if (error.message === 'Entry Not Inserted'){
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">There was error creating your post, please try again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Invalid Email or weak password, make sure password is more than 5 letters');
  } else if(error.message === 'Internal Server Error') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please try again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('A error occured, please try again');
  } else if(error.message === 'Auth failed') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
    window.location.replace('login.html');
    // console.log('A error occured, please try again');
  }

  errorClose.onclick = function(){
    errorHead.classList.remove('errorHeader');
    errorHead.classList.add('errorHeaderNone');
  }
}


// Handles updating an entry

// The (x) on top for closing the modal
span.onclick = function () {
  modal.style.display = 'none';
  editTitle.contentEditable = 'false';
  editText.contentEditable = 'false';
  saveBtn.innerHTML = 'DELETE';
  editBtn.innerHTML = 'EDIT';
};



let theParent = document.querySelector("#myWrapper");
theParent.addEventListener("click", showModal, false);

function showModal(e) {
  // console.log(e.target);
    if (e.target !== e.currentTarget) {
        let clickedItem = e.target.id;
        modal.style.display = 'block';
        editText.style.overflow = 'auto';
        editTitle.style.overflow = 'auto';
        editTitle.innerHTML = entries[clickedItem].title;
        editText.innerHTML = entries[clickedItem].description;

        editBtn.onclick = function () {
          if(editBtn.textContent === 'DELETE'){
            deletePost(clickedItem);
          }
          editTitle.contentEditable = 'true';
          editText.contentEditable = 'true';
          saveBtn.innerHTML = 'SAVE';
          editBtn.innerHTML = 'DELETE';
        };

        saveBtn.onclick = function () {
          if(saveBtn.textContent === 'DELETE'){
            deletePost(clickedItem);
          } else if(saveBtn.textContent === 'SAVE'){
            updatePost(clickedItem);
          }
          editTitle.contentEditable = 'false';
          editText.contentEditable = 'false';
          saveBtn.innerHTML = 'DELETE';
          editBtn.innerHTML = 'EDIT';
          modal.style.display = 'none';
        };
    }
    e.stopPropagation();
}

function updatePost(clickedItem){
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
  gradientBg.classList.remove('loaderNone');
  gradientBg.classList.add('gradient');
  const title = editTitle.textContent;
  const text = editText.textContent;
  const id = entries[clickedItem].id;
  console.log(id);
  fetch(`https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/entries/${id}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'mode':'no-cors',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, text }),
    })
    .then(handleResponse)
    .then(data => successUpdate(data))
    .catch(error => erroredUpdate(error))
}

function successUpdate(data){
  gradientBg.classList.remove('gradient');
  gradientBg.classList.add('loaderNone');
  loadEntries(data);
}

function erroredUpdate(error){
  if (error.message === 'Bad Request'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Your update must have a title and body<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if (error.message === 'Entry Not Found'){
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Could not retrieve updated entries, please reload<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Invalid Email or weak password, make sure password is more than 5 letters');
  } else if(error.message === 'Internal Server Error') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please try again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('A error occured, please try again');
  } else if(error.message === 'Auth failed') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
    window.location.replace('login.html');
    // console.log('A error occured, please try again');
  } else if(error.message === 'Entry can not be modified') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">You cannot modify an entry after 1 day<span class="errorClose" id="errorClose">&times;</span></h4>';
    // window.location.replace('login.html');
    // console.log('A error occured, please try again');
  }

  errorClose.onclick = function(){
    errorHead.classList.remove('errorHeader');
    errorHead.classList.add('errorHeaderNone');
  }
}


function deletePost(clickedItem){
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
  gradientBg.classList.remove('loaderNone');
  gradientBg.classList.add('gradient');
  const title = editTitle.textContent;
  const text = editText.textContent;
  const id = entries[clickedItem].id;
  console.log(id);
  fetch(`https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/entries/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'mode':'no-cors',
      'Authorization': `Bearer ${token}`,
    },
    })
    .then(handleResponse)
    .then(data => successDelete(data))
    .catch(error => erroredDelete(error))
}

function successDelete(data){
  gradientBg.classList.remove('gradient');
  gradientBg.classList.add('loaderNone');
  loadEntries(data);
}

function erroredDelete(error){
  if (error.message === 'Entry does not exist'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Entry has been deleted already<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if (error.message === 'Entry Not Found'){
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Could not retrieve updated entries, please reload<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Invalid Email or weak password, make sure password is more than 5 letters');
  } else if(error.message === 'Internal Server Error') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please try again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('A error occured, please try again');
  } else if(error.message === 'Auth failed') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
    window.location.replace('login.html');
    // console.log('A error occured, please try again');
  } else if(error.message === 'Entry can not be modified') {
    gradientBg.classList.remove('gradient');
    gradientBg.classList.add('loaderNone');
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">You cannot modify an entry after 1 day<span class="errorClose" id="errorClose">&times;</span></h4>';
    // window.location.replace('login.html');
    // console.log('A error occured, please try again');
  }

  errorClose.onclick = function(){
    errorHead.classList.remove('errorHeader');
    errorHead.classList.add('errorHeaderNone');
  }
}

window.onscroll = function () { myFunction(); };

const header = document.getElementById('myHeader');
const sticky = header.offsetTop;
const headerHeight = header.offsetHeight;
const scrollHeader = header.scrollHeight;
// console.log(headerHeight);
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
    loadDiv.style.position = 'fixed';
    gradientBg.style.position = 'fixed';
    errorHead.classList.add('stickyError');
    errorHead.style.top = `${scrollHeader}px`;
  } else {
    header.classList.remove('sticky');
    errorHead.classList.remove('stickyError');
  }
}

function checkMedia(x) {
    if (x.matches) { // If media query matches
        errorHead.style.top = `${headerHeight}px`;
    } else {
        errorHead.style.top = `${scrollHeader}px`;
    }
}

let x = window.matchMedia("(max-width: 700px)");
checkMedia(x);
x.addListener(checkMedia);
