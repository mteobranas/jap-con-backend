//CONSTANTES
const BTN = document.getElementById('btn')
const COMMENTS_CONTAINER = document.getElementById('commentsContainer')

// Bloque encargado del cierre de sesión
document.getElementById('cerrar_sesion').addEventListener('click', (a) => {
  localStorage.removeItem('token')
  window.location.href = 'login.html'
})

//Carta del producto
let cardsContainer = document.getElementById('cardsContainer')

function producto(data) {
  const images = JSON.parse(data[0].images)
  cardsContainer.innerHTML += `
  <div class="container px-4 px-lg-5 my-5">
  <div class="row gx-4 gx-lg-5 align-items-center">
    <div class="col-md-6">
      <div id="prodCarousel" class="carousel slide carousel-fade">
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#prodCarousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#prodCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#prodCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
          <button
            type="button"
            data-bs-target="#prodCarousel"
            data-bs-slide-to="3"
            aria-label="Slide 4"
          ></button>
        </div>
        <div class="carousel-inner">
          <div class="carousel-item active">
            <img src="${images[0]}" class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="${images[1]}" class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="${images[2]}" class="d-block w-100" alt="..." />
          </div>
          <div class="carousel-item">
            <img src="${images[3]}" class="d-block w-100" alt="..." />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#prodCarousel"
          data-bs-slide="prev"
        >
          <span
            class="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#prodCarousel"
          data-bs-slide="next"
        >
          <span
            class="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <div class="col-md-6">
      <div class="small mb-1">
        ${data[0].sold_count} vendidos
      </div>
      <h1 class="display-5 fw-bolder">${data[0].name}</h1>
      <br />
      <div class="form-group mb-3 w-50 d-flex">
        <input
          id="buy_input"
          onchange="count(this.value)"
          type="number"
          value="0"
          min="0"
          class="form-control"
        />
        <button
          type="button"
          onclick="currentProd(productInfo); toastSpan();"
          class="btn btn-success comprar"
          id="liveToastBtn"
        >
          Comprar
        </button>
      </div>
      <div class="fs-5 mb-5">
        <span>${data[0].currency} ${data[0].cost}</span>
      </div>
      <h4>Descripción:</h4>
      <br />
      <p class="lead">${data[0].description}</p>
      <div class="d-flex"></div>
    </div>
  </div>
</div>
`
}

//Toast para confirmar que se agregó el prodcuto
function toast() {
  let toast = document.getElementById('liveToast')
  var liveToast = new bootstrap.Toast(toast)
  liveToast.show()
}

//COUNT FUNCTION
let COUNT = 1
function count(valor) {
  COUNT = valor
}

//Función que guarda la info del producto
let productInfo

function info(data) {
  productInfo = data
}

//Se cambia el nombre del toast para cuando se agrega un producto al carrito

let toastName = document.getElementById('toastName')

function toastSpan() {
  toastName.innerHTML = productInfo.name
}

//Guarda el id del producto
function setProdID(id) {
  localStorage.setItem('prodID', id)
  window.location = 'product-info.html'
}

//Función que agrega productos relacionados en la información del productoa
let productosRelacionados = document.getElementById('productosRelacionados')

function productoRelacionado(data) {
  for (let i = 0; i < data.length; i++)
    productosRelacionados.innerHTML += `
    <div
      onclick="setProdID(${data[i].id})"
      class="card"
      style="width: 18rem; cursor: pointer"
    >
      <img src="${data[i].image}" class="card-img-top" alt=".." />
      <div class="card-body">
        <p class="card-text">${data[i].name}</p>
      </div>
    </div>
    `
}

document.addEventListener('DOMContentLoaded', function (e) {
  getUser()
  getUserStatus()
  showUser()
  temaActivo()

  fetch(PRODUCT_INFO_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token')),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      info(data)
      producto(data)
      productoRelacionado(data[0].related_products)
    })

  fetch(COMMENTS, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token')),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      comentarios(data)
    })
})

//Contenedor de comentarios
function comentarios(data) {
  COMMENTS_CONTAINER.innerHTML = ''
  data.forEach((element) => {
    COMMENTS_CONTAINER.innerHTML += `
      <div class="card">
        <div class="card-body">
          <h5>${element.first_name} | ${element.email}</h5>
            <p>${element.description}</p>
            ${mostrarEstrellas(element.score)}
            <p>${element.date_time}</p>
        </div>
      </div>
      `
  })
}

//Esta funcion agrega un comentario de forma manual, agregando también la puntuación.
function addComment() {
  let commentForm = commentForm((comment, rating, date, prod_id))

  document.getElementById('comment').value = ''
  document.getElementById('rating').value = 1
}

//Plantilla para el fetch del comentario
//Funcion que genera estrellas

function mostrarEstrellas(puntaje) {
  let estrellas = []
  //El primer  (for) te devuelve x estrellas pintadas
  for (let i = 0; i < puntaje; i++) {
    estrellas.push("<span class='fa fa-star checked'></span>")
  }
  //El segundo (for) te devuelve 5-x sin pintar
  for (let j = 0; j < 5 - puntaje; j++) {
    estrellas.push("<span class='fa fa-star'></span>")
  }
  //El (join) hace que los (elementos) del array se unan
  return estrellas.join('')
}

//Función que guarda un elemento en el carrito
function currentProd(product) {
  const token = JSON.parse(localStorage.getItem('token'))
  const item = {
    id: product[0].id,
    quantity: COUNT,
  }
  fetch(CART, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify(item),
  }).then((res) => res.json())

  toast()
  document.getElementById('buy_input').value = 0
}

//SECCIÓN DE COMENTARIOS

const COMMENT = document.getElementById('comment')
const RATING = document.getElementById('rating')
const COMBTN = document.getElementById('comBtn')

function disabledBTN() {
  if (
    COMMENT.checkValidity() &&
    RATING.checkValidity() &&
    RATING.value !== ''
  ) {
    COMBTN.removeAttribute('disabled')
  }
}

COMMENT.addEventListener('input', () => {
  const isValid = COMMENT.checkValidity()

  if (isValid) {
    COMMENT.classList.remove('is-invalid')
    COMMENT.classList.add('is-valid')
  } else {
    COMMENT.classList.remove('is-valid')
    COMMENT.classList.add('is-invalid')
  }
  disabledBTN()
})

RATING.addEventListener('input', () => {
  const isValid = RATING.checkValidity()

  if (isValid) {
    RATING.classList.remove('is-invalid')
    RATING.classList.add('is-valid')
  } else {
    RATING.classList.remove('is-valid')
    RATING.classList.add('is-invalid')
  }
  disabledBTN()
})

function commentaryForm(comment, rating, date, prod_id) {
  let commentary = {
    score: rating,
    description: comment,
    date_time: date,
    prod_id: prod_id,
  }

  return commentary
}

document.getElementById('commentForm').addEventListener('submit', (e) => {


  e.preventDefault()
  
  let date = new Date().toLocaleString()
  let prod_id = localStorage.getItem('prodID')
  let token = localStorage.getItem('token')

  let commentValue = COMMENT.value
  let ratingValue = RATING.value

  let commentary = commentaryForm(commentValue, ratingValue, date, prod_id)

  console.log(commentary)

  fetch(COMMENTSPOST, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: JSON.parse(token),
    },
    body: JSON.stringify(commentary),
  })
    .then((response) => response.json())
    .then((data) => {
      // Puedes manejar la respuesta del servidor si es necesario
      console.log(data)
    })
    .catch((error) => {
      e.stopImmediatePropagation()
      console.error('Error al agregar el comentario: ', error)
    })

    fetch(COMMENTS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: JSON.parse(localStorage.getItem('token')),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        comentarios(data)
      })
})
