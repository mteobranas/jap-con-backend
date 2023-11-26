document.addEventListener('DOMContentLoaded', function () {
  getUser()
  getUserStatus()
  temaActivo()
  showUser()

  //Fetch para la información del carrito de compras
  fetch(CART, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token')),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      showCartItems(data)
    })
})

// Bloque encargado del cierre de sesión
document.getElementById('cerrar_sesion').addEventListener('click', (a) => {
  localStorage.removeItem('userStatus')
  localStorage.removeItem('currentUser')
  window.location.href = 'login.html'
})

function validarNegativo(valor) {
  if (valor.value < 1) {
    valor.value = 1
    return valor.value
  }
}

function showCartItems(array) {
  const cartItems = document.getElementById('cartItems')

  for (let i = 0; i < array.length; i++) {
    const image = JSON.parse(array[i].images)[0]
    cartItems.innerHTML += `
    <div class="row align-items-center text-center g-3 my-1 border-bottom">
      <div class="col-6 col-md-2">
        <img src="${image}" class="img-fluid rounded" alt="Producto">
      </div>
      <div class="col-6 col-md-2">
        <h4>${array[i].name}</h4>
      </div>
      <div class="col-6 col-md-2">
        <h5>${array[i].currency} ${array[i].cost}</h5>
      </div>
      <div class="col-6 col-md-2">
        <input id="${array[i].id}" type="number" class="form-control" value="${array[i].quantity}" min="1" onchange="validarNegativo(this); calcSubTotal(this, ${array[i].cost}, ${array[i].id}); calcTotal()">
      </div>
      <div class="col-6 col-md-2">
        <h5>${array[i].currency} <span class="${array[i].id} subtotal">${array[i].cost}</span></h5>
      </div>
      <div class="col-6 col-md-2">
        <button class="btn btn-danger botones" value="${array[i].id}" onclick="removeProduct(this, ${array[i].id})">Eliminar</button>
      </div>
    </div>
    `
  }
  calcTotal()
}

function calcSubTotal(elemento, precio, id) {
  let subTotalValue = elemento.value * precio
  let subTotalField = document.getElementsByClassName(id)[0]
  subTotalField.innerHTML = subTotalValue
}

function calcTotal(valorEnvio) {
  let subTotalArray = document.querySelectorAll('.subtotal')
  let envio = valorEnvio ?? 0.07
  let sumOfSubTotal = 0
  subTotalArray.forEach((elemento) => {
    sumOfSubTotal += parseInt(elemento.innerHTML)
  })

  let endSubTotal = document.getElementById('subtotal')
  let endEnvio = document.getElementById('precioEnvio')
  let endTotal = document.getElementById('total')

  endSubTotal.innerHTML = sumOfSubTotal
  endEnvio.innerHTML = Math.floor(sumOfSubTotal * envio)
  endTotal.innerHTML = Math.floor(sumOfSubTotal * envio + sumOfSubTotal)
}

function removeProduct(elemento, id) {
  fetch(`http://localhost:3000/cart/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token')),
    },
  })
  elemento.parentElement.parentElement.remove()
  calcTotal()
}

function validateInput(input) {
  if (!input.checkValidity()) {
    input.setAttribute('class', 'form-control is-invalid')
    return false
  } else {
    input.setAttribute('class', 'form-control is-valid')
    return true
  }
}

document.getElementById('formEnvio').addEventListener('submit', (e) => {
  e.preventDefault()

  let calle = document.getElementById('calle')
  let numero = document.getElementById('numero')
  let ciudad = document.getElementById('ciudad')
  let esquina = document.getElementById('esquina')
  let departamento = document.getElementById('departamento')
  let codigo_postal = document.getElementById('codigo_postal')

  let bank_account = document.getElementById('payment-bank-account')
  let credit_card = document.getElementById('payment-credit-card')

  validateInput(calle)
  validateInput(numero)
  validateInput(ciudad)
  validateInput(esquina)
  validateInput(departamento)
  validateInput(codigo_postal)

  if (
    (validateInput(calle) &&
      validateInput(numero) &&
      validateInput(ciudad) &&
      validateInput(esquina) &&
      validateInput(departamento) &&
      validateInput(codigo_postal) &&
      bank_account.checked) ||
    credit_card.checked
  ) {
    console.log('Solicitud de compra enviada')
    fetch(CART, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        authorization: JSON.parse(localStorage.getItem('token')),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message)
      })
  } else {
    return
  }
})

//Detalles en el modal de pago

let bank_account = document.getElementById('payment-bank-account')
let credit_card = document.getElementById('payment-credit-card')
let bank_account_number = document.getElementById('bank-account-number')
let credit_card_number = document.getElementById('credit-card-number')
let credit_card_sec_code = document.getElementById('credit-card-sec-code')
let credit_card_exp_date = document.getElementById('credit-card-expire-date')

document.getElementById('btnSeleccionar').addEventListener('click', (e) => {
  let modal = document.getElementById('modalPago')
  let textoPago = document.getElementById('display-metodo-pago')

  if (bank_account.checked) {
    textoPago.innerHTML = 'Cuenta de banco'
  } else if (credit_card.checked) {
    textoPago.innerHTML = 'Tarjeta de credito'
  }
})

bank_account.addEventListener('change', () => {
  credit_card_number.value = ''
  credit_card_sec_code.value = ''
  credit_card_exp_date.value = ''
})

credit_card.addEventListener('change', () => {
  if (credit_card.checked) {
    bank_account_number.value = ''
  } else {
    return
  }
})
