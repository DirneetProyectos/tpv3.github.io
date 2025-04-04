export function renderProducts(categories, productsButtons) {
  productsButtons.innerHTML = '';

  categories.forEach((category, catIndex) => {
    category.products?.forEach(product => {
      const btn = document.createElement('button');
      btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
      btn.classList.add('btn', 'btn-primary');
      btn.onclick = () => addProductToCart(product.name, product.price);
      productsButtons.appendChild(btn);
    });

    category.subcategories?.forEach(subcategory => {
      subcategory.products?.forEach(product => {
        const btn = document.createElement('button');
        btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
        btn.classList.add('btn', 'btn-primary');
        btn.onclick = () => addProductToCart(product.name, product.price);
        productsButtons.appendChild(btn);
      });
    });
  });
}

function addProductToCart(name, price) {
  // Lógica para añadir producto al carrito
}