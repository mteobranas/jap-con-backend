const ORDER_ASC_BY_NAME = 'AZ'
const ORDER_DESC_BY_NAME = 'ZA'
const ORDER_BY_PROD_COUNT = 'Cant.'
let currentCategoriesArray = []
let currentSortCriteria = undefined
let minCount = undefined
let maxCount = undefined

// Bloque encargado del cierre de sesión
document.getElementById('cerrar_sesion').addEventListener('click', (a) => {
  localStorage.removeItem('userStatus')
  localStorage.removeItem('currentUser')
  window.location.href = 'login.html'
})

function sortCategories(criteria, array) {
  let result = []
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.name > b.name) {
        return -1
      }
      if (a.name < b.name) {
        return 1
      }
      return 0
    })
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.productCount)
      let bCount = parseInt(b.productCount)

      if (aCount > bCount) {
        return -1
      }
      if (aCount < bCount) {
        return 1
      }
      return 0
    })
  }

  return result
}

function setCatID(id) {
  localStorage.setItem('catID', id)
  window.location = 'products.html'
}

function showCategoriesList() {
  let htmlContentToAppend = ''
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    let category = currentCategoriesArray[i]

    if (
      (minCount == undefined ||
        (minCount != undefined &&
          parseInt(category.productCount) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(category.prod_count) <= maxCount))
    ) {
      htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.image}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.prod_count} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
    }

    document.getElementById('cat-list-container').innerHTML =
      htmlContentToAppend
  }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria

  if (categoriesArray != undefined) {
    currentCategoriesArray = categoriesArray
  }

  currentCategoriesArray = sortCategories(
    currentSortCriteria,
    currentCategoriesArray
  )

  //Muestro las categorías ordenadas
  showCategoriesList()
}

document.addEventListener('DOMContentLoaded', function (e) {
  getUser()
  getUserStatus()
  showUser()
  temaActivo()

  fetch(CATEGORIES_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      authorization: JSON.parse(localStorage.getItem('token')),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      currentCategoriesArray = data

      showCategoriesList()
    })

  document.getElementById('sortAsc').addEventListener('click', function () {
    sortAndShowCategories(ORDER_ASC_BY_NAME)
  })

  document.getElementById('sortDesc').addEventListener('click', function () {
    sortAndShowCategories(ORDER_DESC_BY_NAME)
  })

  document.getElementById('sortByCount').addEventListener('click', function () {
    sortAndShowCategories(ORDER_BY_PROD_COUNT)
  })

  document
    .getElementById('clearRangeFilter')
    .addEventListener('click', function () {
      document.getElementById('rangeFilterCountMin').value = ''
      document.getElementById('rangeFilterCountMax').value = ''

      minCount = undefined
      maxCount = undefined

      showCategoriesList()
    })

  document
    .getElementById('rangeFilterCount')
    .addEventListener('click', function () {
      //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
      //de productos por categoría.
      minCount = document.getElementById('rangeFilterCountMin').value
      maxCount = document.getElementById('rangeFilterCountMax').value

      if (minCount != undefined && minCount != '' && parseInt(minCount) >= 0) {
        minCount = parseInt(minCount)
      } else {
        minCount = undefined
      }

      if (maxCount != undefined && maxCount != '' && parseInt(maxCount) >= 0) {
        maxCount = parseInt(maxCount)
      } else {
        maxCount = undefined
      }

      showCategoriesList()
    })
})