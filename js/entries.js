
const token = localStorage.getItem('token');
const loader = document.getElementById('loadDiv');
const errorHead = document.getElementById('errorHead');
const errorImage = document.getElementById('errImage')

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
    .then(data => loadEntries(data))
    .catch(error => checkErrors(error))
 }

// window.onload = function getEntries(){
//   fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/entries', {
//     method: 'GET',
//     headers: {
//       'Accept': 'application/json, text/plain, */*',
//       'Content-type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//   })
//   .then((res) => res.json())
//   .then((data) => console.log(data))
// }
// <div class="card card-body mb-3">
//   <h3>${post.title}</h3>
//   <p>${post.body}</p>
// </div>
function loadEntries(data){
  loader.classList.remove('loader');
  loader.classList.add('loaderNone');
    let entry = '';
    const entries = data.db;
    data.forEach(function(entries){
      entry += `
      <div class="inner-box">
        <h1>${entries.title}</h1>
        <p>${entries.description}</p>
      </div>
      `;
    });
    document.getElementById('myWrapper').innerHTML = entry;
}

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
    //errorImage.classList.remove('errorImageNone');
    //errorImage.classList.add('login-body');
    document.getElementById('entriesBody').classList.add('errorImage');
    // errorHead.classList.remove('errorHeaderNone');
    //document.getElementById('myWrapper').classList.remove('wrapper');
    //document.getElementById('myWrapper').classList.add('errorHeaderNone');
    // errorHead.classList.add('errorHeader');
    // errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Diary is empty click the + button to add new page<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('A error occured, please try again');
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
