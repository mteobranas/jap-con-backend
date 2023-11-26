document.addEventListener('DOMContentLoaded', function () {
  getUser()
  getUserStatus()
  temaActivo()
})

// Bloque encargado del cierre de sesión
document.getElementById('cerrar_sesion').addEventListener('click', (a) => {
  localStorage.removeItem('userStatus')
  localStorage.removeItem('currentUser')
  window.location.href = 'login.html'
})

const userProfileForm = document.getElementById('userProfileForm')
const saveButton = document.getElementById('saveButton')
const FILE_INPUT = document.getElementById('fileInput')
const PROFILE_PICTURE = document.getElementById('previewImage')

let firstName = document.getElementById('firstName')
let middleName = document.getElementById('middleName')
let lastName = document.getElementById('lastName')
let middleLastName = document.getElementById('middleLastName')
let email = document.getElementById('loginemail')
let phone = document.getElementById('phone')

FILE_INPUT.addEventListener('change', function (e) {
  const file = e.target.files[0]
  console.log(file)
  if (file) {
    const reader = new FileReader()
    reader.onload = function (event) {
      const imageDataURL = event.target.result
      console.log(imageDataURL)
      PROFILE_PICTURE.src = imageDataURL
    }
    reader.readAsDataURL(file)
  }
})

function loadUserData(user) {
  firstName.value = user.first_name || ''
  middleName.value = user.second_name || ''
  lastName.value = user.last_name || ''
  middleLastName.value = user.second_last_name || ''
  email.value = user.email || ''
  phone.value = user.phone || ''

  if (user.avatar) {
    PROFILE_PICTURE.src = user.avatar
  }
}

saveButton.addEventListener('click', () => {
  let user = {
    first_name: firstName.value,
    second_name: middleName.value,
    last_name: lastName.value,
    second_last_name: middleLastName.value,
    email: email.value,
    phone: phone.value,
  }

  const file = FILE_INPUT.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = function (event) {
      const imageDataURL = event.target.result
      PROFILE_PICTURE.src = imageDataURL
      user.avatar = imageDataURL

      // Llamar a la función que maneja la carga de la imagen
      uploadImage(user)
    }
    reader.readAsDataURL(file)
  } else {
    // Si no hay archivo, solo actualizar la información del usuario sin avatar
    updateUser(user)
  }
})

function uploadImage(user) {
  const formData = new FormData()
  formData.append('avatar', FILE_INPUT.files[0])

  fetch(USER_INFO, {
    method: 'POST',
    headers: {
      authorization: JSON.parse(localStorage.getItem('token')),
    },
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    // Puedes manejar la respuesta del servidor si es necesario
    console.log(data)

    // Ahora que la imagen está subida, actualiza el resto de la información del usuario
    updateUser(user)
  })
  .catch(error => {
    console.error('Error al subir la imagen:', error);
  });
}

function updateUser(user) {
  fetch(USER_INFO, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token')),
    },
    body: JSON.stringify(user),
  })
    .then(res => console.log(res))

  alert('Tu perfil ha sido actualizado')
}
