document.getElementById('loginUsers').addEventListener('submit', login);

function login(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/user/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-type': 'application/json',
      'mode':'no-cors'
    },
    body: JSON.stringify({ email, password }),
  })
    .then(res => res.json())
    .then(data => checkLogin(data))
    .catch(error => checkLogin(error))
}

// function handleResponse(response) {
//   return response.json()
//     .then(json => {
//       if (response.ok) {
//         return json
//       } else {
//         let error = Object.assign({}, json, {
//            status: response.status,
//            statusText: response.statusText
//              })
//         return Promise.reject(error)
//       }
//     })
// }
//
// fetch('https://stark-headland-67551.herokuapp.com/https://phemmelliotdiary.herokuapp.com/api/v1/user/login', {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json, text/plain, */*',
//     'Content-type': 'application/json',
//     'mode':'no-cors'
//   },
//   body: JSON.stringify({ email, password }),
//   })
//   .then(handleResponse)
//   .then(data => console.log(data))
//   .catch(error => console.log(error.statusText))

function checkLogin(data){
  if(data.message === 'User does not exist'){
    const header = document.getElementById('myHeader');
    header.classList.add('failedLoginheader');
  }
}
