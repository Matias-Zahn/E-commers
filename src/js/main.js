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
        html += `
        <div class="product">
            <div class='product__img'>
                <img src='${product.image}' alt='imagen-productos'>
                <i class='bx bx-plus' id='${product.id}'></i>
            </div>

            <div class='product__info'>

                <h3>$${product.price} <span>Stock: ${product.quantity}</span></h3>
                <h4>${product.name}</h4>
            </div>
        </div>
        `;

    }

    productsHTML.innerHTML= html
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
}

main()


function cartShow() {
    const cartShow= document.querySelector('.bx-menu');
    const cart= document.querySelector('.cart');

    cartShow.addEventListener('click', () =>{

        cart.classList.add('cart__show')

    })

}


function iconsEvent(){

    const cart_icon= document.querySelector('.bxs-cart-add')
    const carrito= document.querySelector('.carrito')

    cart_icon.addEventListener('click', () => {
        carrito.classList.toggle('carrito__show')
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
    })
}


function drawCarrito(db){

    const carritoProducts= document.querySelector('.carrito__products')

    let html= '';

    for (const products in db.cart) {

        const {name,quantity, price, image, id, amount} = db.cart[products]

        html += `

            <div class="carrito__product" id='${id}'>
                <div class="carrito__product--img">
                    <img src='${image}' alt='image'>
                </div>
                <div class='carrito__product--info'>
                    <h5>${name}</h5>
                    <p>Stock: ${quantity} | $${price}</p>
                    <h4>Subtiotal: $${price} </h4>
                    <div class="carrito__icons">
                        <i class='bx bx-minus'></i>
                        <p> ${amount} Unit</p>
                        <i class='bx bx-plus'></i>
                        <i class='bx bxs-trash' style='color:#ffffff' ></i>
                    </div>
                </div>
            </div>   
        `;
    }

    carritoProducts.innerHTML= html
}