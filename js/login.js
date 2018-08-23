
document.getElementById('loginUsers').addEventListener('submit', login);
const loginbox = document.getElementById('logBox');
const loader = document.getElementById('loadDiv');
const errorHead = document.getElementById('errorHead');
const errorText = document.getElementById('errorHeadText');
function handleResponse(response) {
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

function login(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  loginbox.classList.remove('loginbox');
  loginbox.classList.add('loginboxNone');

  loader.classList.remove('loaderNone');
  loader.classList.add('loader');

  fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'mode':'no-cors'
    },
    body: JSON.stringify({ email, password }),
    })
    .then(handleResponse)
    .then(data => checkLogin(data))
    .catch(error => checkErrors(error))
 }

function checkLogin(data){
    console.log(data.message);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user_id', data.user_id);
    console.log(data);
    window.location.replace('entries.html');
}

function checkErrors(error){
  if (error.message === 'Bad Request'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    loginbox.classList.remove('loginboxNone');
    loginbox.classList.add('loginbox');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Email or password field cannot be empty<span class="errorClose" id="addClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if (error.message === 'Invalid email or password'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    loginbox.classList.remove('loginboxNone');
    loginbox.classList.add('loginbox');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Invalid email or weak password<span class="errorClose" id="errorClose">&times;</span></h4>';
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
  } else if (error.message === 'User does not exist'){
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    loginbox.classList.remove('loginboxNone');
    loginbox.classList.add('loginbox');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Account does not exist, sign up below<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Account does not exist, sign up below');
  }
}

function closeError(){
  errorHead.classList.remove('errorHeader');
  errorHead.classList.add('errorHeaderNone');
}
