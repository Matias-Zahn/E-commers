async function getElements() {
    try {
        const data= await fetch('https://ecommercebackend.fundamentos-29.repl.co/');


        const res= await data.json();

        window.localStorage.setItem('products', JSON.stringify(res));

        return res;

    } catch (error) {
        console.log(error)
    }
}

function paintProducts(db){
    let html= '';

    const productsHTML= document.querySelector('.products');

    for (const product of db.products) {
        const soldOut= product.quantity ? `<i class='bx bx-plus' id='${product.id}'></i>`: "<span class='soldOut' >Sold Out</span>"
        html += `
        <div class="product">
            <div class='product__img'>
                <img src='${product.image}' alt='imagen-productos'>
                ${soldOut}
            </div>

            <div class='product__info'>

                <h3>$${product.price} | <span>Stock: ${product.quantity}</span></h3>
                <h4>${product.name}</h4>
            </div>
        </div>
        `;

    }

    productsHTML.innerHTML= html
}

function cartShow() {
    const cartShow= document.querySelector('.bx-menu');
    const cart= document.querySelector('.cart');

    cartShow.addEventListener('click', () =>{

        cart.classList.add('cart__show')

        cart.addEventListener('click', (e) =>{
            if(e.target.classList.contains('home__a') || e.target.classList.contains('productos__a')){
                cart.classList.remove('cart__show')
            }

            if(e.target.classList.contains('bxs-arrow-from-left')){
                cart.classList.remove('cart__show')
            }
        })
    })

}


function iconsEvent(){

    const cart_icon= document.querySelector('.bxs-cart-add')
    const carrito= document.querySelector('.carrito')

    cart_icon.addEventListener('click', () => {
        carrito.classList.toggle('carrito__show')
    })


    carrito.addEventListener('click', (e) =>{
        if (e.target.classList.contains('bxs-arrow-from-left')){
            carrito.classList.remove('carrito__show')
        }
    })
}

function addCarrito(db) {
    
    const productsHTML= document.querySelector('.products')

    productsHTML.addEventListener('click', (e) => {
        if (e.target.classList.contains('bx-plus')){

            const id= Number(e.target.id);

            const productFind= db.products.find((product) => product.id === id)

            if (db.cart[productFind.id]) {
                if(productFind.quantity === db.cart[productFind.id].amount) return alert('No tenemos mas en Stock')
                db.cart[productFind.id].amount++;
            } else{
                db.cart[productFind.id] = {...productFind, amount: 1};
            }

            window.localStorage.setItem('cart', JSON.stringify(db.cart))
        }

        drawCarrito(db)
        infoComprar(db)
        addToCartIcon(db)
    })
}


function drawCarrito(db){

    const carritoProducts= document.querySelector('.carrito__products')

    let html= '';

    for (const products in db.cart) {

        const {name,quantity, price, image, id, amount} = db.cart[products]

        html += `

            <div class="carrito__product">
                <div class="carrito__product--img">
                    <img src='${image}' alt='image'>
                </div>
                <div class='carrito__product--info'>
                    <h5>${name}</h5>
                    <p>Stock: ${quantity} | $${price}</p>
                    <h4>Subtotal: $${price * amount} </h4>
                    <div class="carrito__icons" id='${id}'>
                        <i class='bx bx-minus'></i>
                        <p> ${amount} Unit</p>
                        <i class='bx bx-plus'></i>
                        <i class='bx bxs-trash'></i>
                    </div>
                </div>
            </div>   
        `;
    }

    carritoProducts.innerHTML= html
}


function darkMode() {
    
    const dark= document.querySelector('.navbar__icons');
    const sun= document.querySelector('.bxs-sun')
    const moon= document.querySelector('.bxs-moon')

    dark.addEventListener('click', (e) => {
        if (e.target.classList.contains('bxs-moon')){
            document.body.classList.add('light__mode')
            sun.style.display= 'flex'
            moon.style.display= 'none'
            
        }

        if(e.target.classList.contains('bxs-sun')){
            document.body.classList.remove('light__mode')
            sun.style.display= 'none'
            moon.style.display= 'flex'
        }
    })
}


function deleteProducts(db) {
    
    const cartProduct= document.querySelector('.carrito__products')

    cartProduct.addEventListener('click', e =>{
        if (e.target.classList.contains('bx-plus')){
            const id= Number(e.target.parentElement.id)

            const productFind= db.products.find((product) => product.id === id)
            if(productFind.quantity === db.cart[productFind.id].amount) return alert('No tenemos mas en Stock')

            db.cart[id].amount++
        }
        if (e.target.classList.contains('bx-minus')){
            const id= Number(e.target.parentElement.id)

            if(db.cart[id].amount === 1){

                const response= confirm('¿Estas seguro que deseas eliminar el producto?')

                if(!response) return
                delete db.cart[id];
            }else{
                db.cart[id].amount--
            }


        }
        if (e.target.classList.contains('bxs-trash')){
            const id= Number(e.target.parentElement.id)
            
            delete db.cart[id];
        }

        window.localStorage.setItem('cart', JSON.stringify(db.cart));
        drawCarrito(db);
        infoComprar(db)
        addToCartIcon(db)
    })
}

function infoComprar(db) {
    const infoTotal= document.querySelector('.info__compra--total')
    const infoAmount= document.querySelector('.info__compra--amount')

    let infoT= 0;
    let infoA= 0;

    for (const product in db.cart) {
        const {price, amount} = db.cart[product]
        infoT += price * amount
        infoA += amount
    }

    infoTotal.textContent= 'Total: $' + infoT +'. 00'
    infoAmount.textContent= 'Cantidad ' + infoA
}

function btnComprar(db){
    const btnComprar= document.querySelector('.btn__buy')

    btnComprar.addEventListener('click', () => {

        if(!Object.values(db.cart).length) return 

        const response= confirm('¿Deseas comprar los siguentes productos?')
        if (!response) return

        const currentProducts= [];

        for (const product of db.products) {
            const productCart= db.cart[product.id]
            if(product.id === productCart?.id){
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount
                })
            }else{
                currentProducts.push(product)
            }
        }

        db.products= currentProducts;
        db.cart= {};

        window.localStorage.setItem('products', JSON.stringify(db.products))
        window.localStorage.setItem('cart', JSON.stringify(db.cart))

        infoComprar(db)
        drawCarrito(db)
        paintProducts(db)
        addToCartIcon(db)
    })
}

function addToCartIcon(db){

    const amountIcon= document.querySelector('.amount__cart')

    let amountCount= 0
    for (const product in db.cart) {
        amountCount += db.cart[product].amount
    }
    
    amountIcon.textContent = amountCount
}

function animationNavbar(){

    const Headeranimation= document.querySelector('.scroll__animation')
    window.addEventListener('scroll', () => {
        if(window.scrollY > 0){
            Headeranimation.classList.add('supp__header--animation')
        }else if(window.scrollY === 0){
            Headeranimation.classList.remove('supp__header--animation');
        }
    })
}

async function main(){

    const db= {
        products: JSON.parse(window.localStorage.getItem('products')) || (await getElements()),
        cart: JSON.parse(window.localStorage.getItem('cart')) || {},

    };
    
    paintProducts(db)
    cartShow()
    iconsEvent()
    addCarrito(db)
    drawCarrito(db)
    deleteProducts(db)
    darkMode()
    infoComprar(db)
    btnComprar(db)
    addToCartIcon(db)
    animationNavbar()
}


window.addEventListener('load', main)