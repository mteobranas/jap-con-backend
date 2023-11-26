document.getElementById('logInButton').addEventListener('click', () => {
  const email = document.getElementById('email').value
  const pass = document.getElementById('pass').value

  let user = {
    email: email,
    password: pass,
  }
  isValidUser(user)
})

function isValidUser(user) {
  fetch(USER_INFO, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        localStorage.setItem('token', JSON.stringify(data))
        window.location.href = 'index.html'
      } else {
        alert('Credenciales incorrectas')
      }
    })
}
