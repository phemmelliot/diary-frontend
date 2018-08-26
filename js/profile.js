
const token = localStorage.getItem('token');

inputEdit.onclick = function(){
  // console.log('inside edit');
  emailField.readOnly = false;
  usernameField.readOnly = false;
}

inputUpdate.onclick = function(){
    const email = emailField.value;
    const username = usernameField.value;
    console.log(email);
    console.log(username);
    if(email === localStorage.getItem('email') && username === localStorage.getItem('username')){
      errorHead.classList.remove('errorHeaderNone');
      errorHead.classList.add('errorHeader');
      errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Edit before updating<span class="errorClose" id="errorClose">&times;</span></h4>';

      errorClose.onclick = function(){
        errorHead.classList.remove('errorHeader');
        errorHead.classList.add('errorHeaderNone');
      }
    } else if( isEmpty(email) || isEmpty(username) || !validateEmail(email)){
      errorHead.classList.remove('errorHeaderNone');
      errorHead.classList.add('errorHeader');
      errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Invalid inputs<span class="errorClose" id="errorClose">&times;</span></h4>';

      errorClose.onclick = function(){
        errorHead.classList.remove('errorHeader');
        errorHead.classList.add('errorHeaderNone');
      }
    } else if (email === localStorage.getItem('email')) {
      form.classList.remove('loginbox');
      form.classList.add('loaderNone');
      loader.classList.remove('loaderNone');
      loader.classList.add('loader');
      fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/user/updatename', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email, username }),
        })
        .then(handleResponse)
        .then(result => updateProfile(result))
        .catch(error => checkUpdateErrors(error))
    } else {
      form.classList.remove('loginbox');
      form.classList.add('loaderNone');
      loader.classList.remove('loaderNone');
      loader.classList.add('loader');
      fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ email, username }),
        })
        .then(handleResponse)
        .then(result => updateProfile(result))
        .catch(error => checkUpdateErrors(error))

    }
}

function updateProfile(result){
  const user = result.profile;
  emailField.value = user.email;
  usernameField.value = user.username;
  localStorage.setItem('email', user.email);
  localStorage.setItem('username', user.username);
  form.classList.remove('loaderNone');
  form.classList.add('loginbox');
  loader.classList.remove('loader');
  loader.classList.add('loaderNone');
}

function checkUpdateErrors(error){
  if (error.message === 'Internal Server Error'){
    console.log(error);
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    form.classList.remove('loaderNone');
    form.classList.add('loginbox');
    emailField.value = localStorage.getItem('email');
    usernameField.value = localStorage.getItem('username');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please reload<span class="errorClose" id="errorClose">&times;</span></h4>';
    // console.log('Email or password field cannot be empty');
  } else if(error.message === 'User Already Exists') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    form.classList.remove('loaderNone');
    form.classList.add('loginbox');
    emailField.value = localStorage.getItem('email');
    usernameField.value = localStorage.getItem('username');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">User with same email already exist<span class="errorClose" id="errorClose">&times;</span></h4>';
  } else if(error.message === 'User Not Found') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    form.classList.remove('loaderNone');
    form.classList.add('loginbox');
    emailField.value = localStorage.getItem('email');
    usernameField.value = localStorage.getItem('username');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please logout and login again<span class="errorClose" id="errorClose">&times;</span></h4>';
  } else if(error.message === 'Auth failed') {
    loader.classList.remove('loader');
    loader.classList.add('loaderNone');
    errorHead.classList.remove('errorHeaderNone');
    errorHead.classList.add('errorHeader');
    form.classList.remove('loaderNone');
    form.classList.add('loginbox');
    emailField.value = localStorage.getItem('email');
    usernameField.value = localStorage.getItem('username');
    errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
    window.location.replace('login.html');
    // console.log('A error occured, please try again');
  }

  console.log(error);
  errorClose.onclick = function(){
    errorHead.classList.remove('errorHeader');
    errorHead.classList.add('errorHeaderNone');
  }
}

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

window.onload = function onload(){
  form.classList.remove('loginbox');
  form.classList.add('loaderNone');
  loader.classList.remove('loaderNone');
  loader.classList.add('loader');
  fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/user/profile', {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'Authorization': `Bearer ${token}`,
      },
    })
    .then(handleResponse)
    .then(result => loadProfile(result))
    .catch(error => checkErrors(error))
 }

 function loadProfile(result){
   console.log(result);
   const user = result.user;
   emailField.value = user.email;
   usernameField.value = user.username;
   localStorage.setItem('email', user.email);
   localStorage.setItem('username', user.username);
   form.classList.remove('loaderNone');
   form.classList.add('loginbox');
   loader.classList.remove('loader');
   loader.classList.add('loaderNone');
 }

 function checkErrors(error){
   console.log(error);
   if (error.message === 'Internal Server Error'){
     loader.classList.remove('loader');
     loader.classList.add('loaderNone');
     errorHead.classList.remove('errorHeaderNone');
     errorHead.classList.add('errorHeader');
     form.classList.remove('loaderNone');
     form.classList.add('loginbox');
     emailField.value = localStorage.getItem('email');
     usernameField.value = localStorage.getItem('username');
     errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">An error occured, please reload<span class="errorClose" id="errorClose">&times;</span></h4>';
     // console.log('Email or password field cannot be empty');
   } else if(error.message === 'User Does not exist') {
     loader.classList.remove('loader');
     loader.classList.add('loaderNone');
     errorHead.classList.remove('errorHeaderNone');
     errorHead.classList.add('errorHeader');
     form.classList.remove('loaderNone');
     form.classList.add('loginbox');
     emailField.value = localStorage.getItem('email');
     usernameField.value = localStorage.getItem('username');
     errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please logout and login again<span class="errorClose" id="errorClose">&times;</span></h4>';
   } else if(error.message === 'Auth failed') {
     loader.classList.remove('loader');
     loader.classList.add('loaderNone');
     errorHead.classList.remove('errorHeaderNone');
     errorHead.classList.add('errorHeader');
     form.classList.remove('loaderNone');
     form.classList.add('loginbox');
     emailField.value = localStorage.getItem('email');
     usernameField.value = localStorage.getItem('username');
     errorHead.innerHTML = '<h4 class="errorText" id="errorHeadText">Please Log In again<span class="errorClose" id="errorClose">&times;</span></h4>';
     window.location.replace('login.html');
     // console.log('A error occured, please try again');
   }

   errorClose.onclick = function(){
     errorHead.classList.remove('errorHeader');
     errorHead.classList.add('errorHeaderNone');
   }
 }


 const validateEmail = (email) => {
   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(email);
 };

 const validatePassword = (password) => {
   if(password.length < 6 || password === ''){
     return false;
   } else {
     return true
   }
 }

 const isEmpty = (input) => {
   if (input === undefined){
     return true;
   }
   else if (input.replace(/\s/g, '').length) {
     return false;
   } else {
     return true;
   }
 }
