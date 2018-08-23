
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
const cards = wrapper.getElementsByTagName('DIV');
let i;
for (i = 0; i < cards.length; i++) {
  cards[i].onclick = function () {
    modal.style.display = 'block';
  };
}

const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const editTitle = document.getElementById('editTitle');
const editText = document.getElementById('editText');

editBtn.onclick = function () {
  editTitle.contentEditable = 'true';
  editText.contentEditable = 'true';
  saveBtn.innerHTML = 'SAVE';
};

saveBtn.onclick = function () {
  editTitle.contentEditable = 'false';
  editText.contentEditable = 'false';
  modal.style.display = 'none';
};


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
  addTitle.onclick = removePlaceHolder;
  addText.onclick = removeTextPlaceHolder;
}

function removePlaceHolder(){
  addTitle.innerHTML = '';
}

function removeTextPlaceHolder(){
  addText.innerHTML = '';
}

closeBtn.onclick = function () {
  addModal.style.display = 'none';
};


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
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
function loadEntries(result){
  loader.classList.remove('loader');
  loader.classList.add('loaderNone');
    let entry = '';
    let index = 0;
    const entries = result.data.entries;
    entries.forEach(function(entries){
      entry += `
      <div class="inner-box">
        <h1>${entries.title}</h1>
        <p>${entries.description}</p>
        <p class="errorHeaderNone">${index}</p>
      </div>
      `;
      index+=1;
    });
    document.getElementById('myWrapper').innerHTML = entry;
}

// const emptyDiary = document.getElementById('emptyDiary');
function checkErrors(error){
  console.log(error);
  if (error.message === 'Internal Server Error'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorImage.classList.remove('errorImageNone');
    errorImage.classList.add('errorImage');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please reload<span class="errorClose" id="addClose">&times;</span></h4>';
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
    // console.log('A error occured, please try again');
  }
}



// Handles Creation of an entry

addSaveBtn.onclick = function saveEntry(){
  addModal.style.display = 'none';
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
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
  loadEntries(data);
}

function erroredPost(error){
  if (error.message === 'Bad Request'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Your entry must have a title and body<span class="errorClose" id="addClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if (error.message === 'Entry Not Inserted'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">There was error creating your post, please try again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Invalid Email or weak password, make sure password is more than 5 letters');
  } else if(error.message === 'Internal Server Error') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    loginbox.classList.remove('loginboxNone');
    loginbox.classList.add('loginbox');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please try again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('A error occured, please try again');
  } else if(error.message === 'Auth failed') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('A error occured, please try again');
  }
}
