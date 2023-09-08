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

        console.log(product);
    }

    productsHTML.innerHTML= html
}




async function main(){

    const db= {
        products: JSON.parse(window.localStorage.getItem('products')) || (await getElements()),
        cart: {},

    };
    
    paintProducts(db)
}

main()

const cartShow= document.querySelector('.bx-menu');
const cart= document.querySelector('.cart');
const menu= document.querySelector('.bx-menu')
const navbar__icons= document.querySelector('.navbar__icons')

cartShow.addEventListener('click', function () {

    if (!navbar__icons.classList.contains('bx-menu')) {
        cart.classList.add('cart__show');
    }

    if (navbar__icons.classList.contains('bx-menu')) {
        cart.classList.remove('cart__show')
    }
    

})
