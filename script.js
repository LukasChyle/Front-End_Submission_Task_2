function fetchAllProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            appendPreviews(data);
        })
        .catch(function (err) {
            console.log('error: ' + err);
        });
}

function appendPreviews(data) {
    const mainContainer = document.getElementById("getProductPreviews");
    for (let i = 0; i < data.length; i++) {
        const element = document.createElement("div");
        element.classList.add("col-xl-3", "col-lg-4", "col-md-6", "col-sm-12");
        element.innerHTML =
            '<div class="product-button" data-bs-toggle="modal"' +
            ' data-bs-target="#product-modal-' + i + '">' +
            '<p class="preview-price">' + data[i].price + " €" + '</p>' + '<br>' +
            '<p>' + data[i].title + '</p>' + '<br>' +
            '<img src=' + data[i].image + ' class="img-fluid" alt="product-picture">' +
            '</div>' +
            '<div class="modal fade modal-xl" id="product-modal-' + i + '">' +
            '<div class="modal-dialog modal-dialog-centered">' +
            '<div class="modal-content">' +
            '<div class="modal-body">' +
            '<div class="product-modal">' +
            '<h1 class="title">' + data[i].price + " €" + '</h1>' + '<br>' +
            '<h2 class="title">' + data[i].title + '</h2>' + '<br>' +
            '<img src=' + data[i].image + ' class="img-fluid" alt="product-picture">' + '<br>' +
            '<p class="description">' + data[i].description + '</p>' +
            '<div class="modal-footer justify-content-center"> ' +
            '<button class="to-cart-but btn btn-primary opacity-90 col-6 mx-3" onclick="addToCart(this.id)"' +
            ' id="' + (i + 1) + '">Add to cart</button>' +
            '<button class="btn btn-danger opacity-90 col-6 mx-3" data-bs-dismiss="modal">Close</button></div> ' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        mainContainer.appendChild(element);
    }
}

async function addToCart(id) {
    const cart = new Map(JSON.parse(localStorage.getItem('cart')));
    let values = []
    let quantity = 0

    if (cart.has(id.toString())) {
        values = cart.get(id.toString())
        values[0] += 1;
    } else {
        await fetch('https://fakestoreapi.com/products/' + id)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                values[0] = 1
                values[1] = data.title
                values[2] = data.price
            })
            .catch(function (err) {
                console.log('error: ' + err);
            });
    }
    cart.set(id.toString(), values)
    localStorage.setItem('cart', JSON.stringify(Array.from(cart)));

    console.log(localStorage.getItem('cart'))
    refreshCart()
}

function reduceQuantity(id) {
    const cart = new Map(JSON.parse(localStorage.getItem('cart')));
    if (cart.has(id.toString())) {
        const values = cart.get(id.toString())
        if (values[0] > 1) {
            values[0] -= 1
            cart.set(id.toString(), values)
            localStorage.setItem('cart', JSON.stringify(Array.from(cart)));
            refreshCart()
        }
    }
}

function removeFromCart(id) {
    const cart = new Map(JSON.parse(localStorage.getItem('cart')));
    if (cart.has(id.toString())) {
        cart.delete(id.toString())
        localStorage.setItem('cart', JSON.stringify(Array.from(cart)));
        refreshCart()
    }
}

function removeAll() {
    localStorage.removeItem('cart')
    refreshCart()
}

function appendCart() {
    localStorage.removeItem('totalPrice')
    const mainContainer = document.getElementById("getCart");
    const cart = new Map(JSON.parse(localStorage.getItem('cart')));

    if (cart.size === 0) {
        const element = document.createElement("div");
        element.classList.add("col-12");
        element.innerHTML =
            '<div class="d-flex justify-content-end">' +
            '<h1>Cart is empty</h1>' +
            '</div>';
        mainContainer.appendChild(element);
    } else {
        let totalPrice = 0;
        for (let [key, values] of cart) {
            const element = document.createElement("div");
            element.classList.add("col-12");
            element.innerHTML =
                '<div class="d-flex justify-content-end">' +
                '<p id="cart-item">' + values[1] + '</p>' +
                '<p id="cart-item">' + values[2] + ' €</p>' +
                '<button onclick="reduceQuantity(' + key + ')" id="cart-item">-</button> ' +
                '<p id="cart-item">' + values[0] + '</p>' +
                '<button onclick="addToCart(' + key + ')" id="cart-item">+</button> ' +
                '<button onclick="removeFromCart(' + key + ')" id="cart-item" class="btn btn-danger opacity-90" >remove</button> ' +
                '</div>';
            mainContainer.appendChild(element);
            totalPrice += values[2] * values[0];
        }
        localStorage.setItem('totalPrice', totalPrice.toString())

        console.log(localStorage.getItem('totalPrice'))
        const element = document.createElement("div");
        element.classList.add("col-12");
        element.innerHTML =
            '<div class="d-flex justify-content-end">' +
            '<h1 id="cart-item">Total: ' +
            (Math.round(localStorage.getItem('totalPrice') * 100) / 100).toFixed(2) + ' €</h1>' +
            '</div>' +
            '<div class="d-flex justify-content-end">' +
            '<a href="order.html" class="btn btn-primary col-3">Order</a>' +
            '</div>';
        mainContainer.appendChild(element);
    }
}

function appendPurchase() {
    localStorage.removeItem('totalPrice')
    const mainContainer = document.getElementById("getPurchase");
    const cart = new Map(JSON.parse(localStorage.getItem('cart')));

    let totalPrice = 0;
    for (let [key, values] of cart) {
        const element = document.createElement("div");
        element.classList.add("col-12");
        element.innerHTML =
            '<div class="d-flex justify-content-end">' +
            '<p id="cart-item">' + values[1] + '</p>' +
            '<p id="cart-item">' + values[2] + ' €</p>' +
            '<p id="cart-item">x ' + values[0] + '</p>' +
            '</div>';
        mainContainer.appendChild(element);
        totalPrice += values[2] * values[0];
    }
    localStorage.setItem('totalPrice', totalPrice.toString())

    console.log(localStorage.getItem('totalPrice'))
    const element = document.createElement("div");
    element.classList.add("col-12");
    element.innerHTML =
        '<div class="d-flex justify-content-end">' +
        '<h1 id="cart-item">Total: ' +
        (Math.round(localStorage.getItem('totalPrice') * 100) / 100).toFixed(2) + ' €</h1>' +
        '</div>';
    mainContainer.appendChild(element);
}

function refreshCart() {
    $("#getCart").html("");
    appendCart()
}

let formName = document.getElementById("nameForm")
let formEmail = document.getElementById("emailForm")
let formPhone = document.getElementById("phoneForm")
let formAddress = document.getElementById("addressForm")
let formCity = document.getElementById("cityForm")
let formZip = document.getElementById("zipForm")
let buyButton = document.getElementById("buttonBuy")
let validationStatus = 0

buyButton.addEventListener("click", function (event) {
    event.preventDefault()
    validateName(formName.value)
    validateEmail(formEmail.value)
    validatePhone(formPhone.value)
    validateAddress(formAddress.value)
    validateCity(formCity.value)
    validateZip(formZip.value)
    console.log(validationStatus)
    console.log(formName.value)
    console.log(formEmail.value)
    console.log(formPhone.value)
    console.log(formAddress.value)
    console.log(formCity.value)
    console.log(formZip.value)

    if (validationStatus === 0) {
        console.log("Success")
        let obj = {
            customerName: formName.value,
            customerEmail: formEmail.value,
            customerPhone: formPhone.value,
            customerAddress: formAddress.value,
            customerCity: formCity.value,
            customerZip: formZip.value
        }
        let objJSON = JSON.stringify(obj)
        localStorage.setItem("localCustomerData", objJSON)
        window.open("confirmation.html", '_self');
    } else {
        console.error("Error")
    }
    validationStatus = 0
})

function loadAndClearInfo() {
    let customerDataJSON = localStorage.getItem("localCustomerData")
    let customerData = JSON.parse(customerDataJSON)
    let displayInfo = document.getElementById("orderconf")
    displayInfo.innerHTML =
        '<div class="order-confirm">' +
        '<h2 id="confhead">Order Confirmation</h2>' +
        '<br>' +
        '</div>' +
        '<div class="center">' +
        '<p>Name:</p>' +
        '<h4>' + customerData.customerName + '</h4>' +
        '<p>E-mail:</p>' +
        '<h4>' + customerData.customerEmail + '</h4>' +
        '<p>Phone:</p>' +
        '<h4>' + customerData.customerPhone + '</h4>' +
        '<p>Address:</p>' +
        '<h4>' + customerData.customerAddress + '</h4>' +
        '<p>Locality:</p>' +
        '<h4>' + customerData.customerCity + '</h4>' +
        '<p>Zip-code:</p>' +
        '<h4>' + customerData.customerZip + '</h4>' +
        '</div>'
    localStorage.removeItem("localCustomerData")
    removeAll()
}

function validateName(name) {
    if (name.length < 2 || name.length > 50) {
        alert("Name must be between 2-50 characters.")
        validationStatus += 1
    }
}

function validateEmail(email) {
    if (!email.includes("@") && email.length > 50) {
        alert("E-mail must contain @, max 50 characters")
        validationStatus += 1
    }
}

function validatePhone(phone) {
    let regExp = /[a-öA-Ö]/i;

    if (regExp.test(phone) || phone.length > 50 || phone.length === 0) {
        alert("Phone number may only contain digits and max 50.")
        validationStatus += 1
    }
}

function validateAddress(address) {
    if (address.length < 4 || address.length > 50) {
        alert("Address must be between 4-50 characters.")
        validationStatus += 1
    }
}

function validateCity(city) {
    if (city.length < 2 || city.length > 50) {
        alert("Locality must be between 2-50 characters.")
        validationStatus += 1
    }
}

function validateZip(zip) {
    if (zip.length > 6 || zip[3] !== " ") {
        alert("Zip code must be in this format: xxx xx")
        validationStatus += 1
    }
}