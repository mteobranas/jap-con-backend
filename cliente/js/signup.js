function createUser() {
  const firstName = document.getElementById('firstName')
  const lastName = document.getElementById('lastName')
  const email = document.getElementById('email')
  const pass = document.getElementById('pass')

  if (
    firstName.checkValidity() &&
    lastName.checkValidity() &&
    email.checkValidity() &&
    pass.checkValidity()
  ) {
    let user = {
      first_name: firstName.value,
      last_name: lastName.value,
      email: email.value,
      password: pass.value,
    }
    return user
  } else {
    alert('Complete todos los campos correctamente')
  }
}

document.getElementById('signupForm').addEventListener('submit', (e) => {
  e.preventDefault()

  const user = createUser()
  console.log(user)
  fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText)
      } else {
        window.location.href = './login.html'
      }
    })
    .catch((error) => {
      alert(error)
    })
})
