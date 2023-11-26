document.addEventListener('DOMContentLoaded', function () {
  getUser()
  getUserStatus();
  showUser()
  temaActivo()

  document.getElementById('autos').addEventListener('click', function () {
    localStorage.setItem('catID', 1)
    window.location = 'products.html'
  })
  document.getElementById('juguetes').addEventListener('click', function () {
    localStorage.setItem('catID', 2)
    window.location = 'products.html'
  })
  document.getElementById('muebles').addEventListener('click', function () {
    localStorage.setItem('catID', 3)
    window.location = 'products.html'
  })
})

// Bloque encargado del cierre de sesión
document.getElementById('cerrar_sesion').addEventListener('click', (a) => {
  localStorage.removeItem('userStatus')
  localStorage.removeItem('currentUser')
  localStorage.removeItem('token')
  window.location.href = 'login.html'
})


