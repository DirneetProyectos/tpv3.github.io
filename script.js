// Variables globales
const categoriesList = document.getElementById('categories-list');
const categoryInput = document.getElementById('category-input');
const addCategoryBtn = document.getElementById('add-category');

const categorySelect = document.getElementById('category-select');
const productNameInput = document.getElementById('product-name');
const productPriceInput = document.getElementById('product-price');
const addProductBtn = document.getElementById('add-product');
const productsList = document.getElementById('products-list');

const categoriesButtons = document.getElementById('categories-buttons');
const productsButtons = document.getElementById('products-buttons');
const ticketItems = document.getElementById('ticket-items');
const totalAmount = document.getElementById('total-amount');
const clearTicketBtn = document.getElementById('clear-ticket');

const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const saveChangesBtn = document.getElementById('save-changes');
const modal = document.getElementById('management-modal');
const closeIcon = document.querySelector('.close');

const exportDataBtn = document.getElementById('export-data');
const importFileInput = document.getElementById('import-file');
const printTicketBtn = document.getElementById('print-ticket');

let categories = [];
let products = [];
let cart = [];
let ticketNumber = 1;

// Cargar datos desde localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem('tpv_data');
  if (savedData) {
    const data = JSON.parse(savedData);
    categories = data.categories || [];
    products = data.products || [];
    renderCategories();
    renderProducts();
  }
}

// Guardar datos en localStorage
function saveToLocalStorage() {
  const data = {
    categories: categories,
    products: products
  };
  localStorage.setItem('tpv_data', JSON.stringify(data));
}

// Función para abrir la ventana modal
openModalBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

// Función para cerrar la ventana modal
function closeModal() {
  modal.style.display = 'none';
}

closeModalBtn.addEventListener('click', closeModal);
closeIcon.addEventListener('click', closeModal);

// Función para guardar cambios (opcional)
saveChangesBtn.addEventListener('click', () => {
  alert('Cambios guardados exitosamente.');
  closeModal();
});

// Función para renderizar categorías
function renderCategories() {
  categoriesList.innerHTML = '';
  categorySelect.innerHTML = '';

  categories.forEach((category, index) => {
    const li = document.createElement('li');
    li.textContent = category.name;
    li.dataset.index = index;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.onclick = () => deleteCategory(index);
    li.appendChild(deleteBtn);

    categoriesList.appendChild(li);

    const option = document.createElement('option');
    option.value = index;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  renderCategoriesButtons();
  saveToLocalStorage();
}

// Función para renderizar botones de categorías
function renderCategoriesButtons() {
  categoriesButtons.innerHTML = '';

  categories.forEach((category, index) => {
    const btn = document.createElement('button');
    btn.textContent = category.name;
    btn.classList.add('btn', 'btn-primary');
    btn.onclick = () => filterProductsByCategory(index);
    categoriesButtons.appendChild(btn);
  });
}

// Función para eliminar una categoría
function deleteCategory(index) {
  categories.splice(index, 1);
  products = products.filter(product => product.categoryIndex !== index);
  renderCategories();
  renderProducts();
}

// Función para añadir una categoría
addCategoryBtn.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (categoryName) {
    categories.push({ name: categoryName });
    categoryInput.value = '';
    renderCategories();
  }
});

// Función para renderizar productos
function renderProducts() {
  productsList.innerHTML = '';
  productsButtons.innerHTML = '';

  products.forEach((product, index) => {
    const li = document.createElement('li');
    li.textContent = `${product.name} - ${product.price.toFixed(2)} € (${categories[product.categoryIndex].name})`;
    li.dataset.index = index;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.classList.add('btn', 'btn-secondary');
    editBtn.onclick = () => editProduct(index);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.onclick = () => deleteProduct(index);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    productsList.appendChild(li);

    const btn = document.createElement('button');
    btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
    btn.classList.add('btn', 'btn-primary');
    btn.onclick = () => addProductToCart(product.name, product.price);
    productsButtons.appendChild(btn);
  });

  saveToLocalStorage();
}

// Función para filtrar productos por categoría
function filterProductsByCategory(categoryIndex) {
  productsButtons.innerHTML = '';

  products
    .filter(product => product.categoryIndex === categoryIndex)
    .forEach(product => {
      const btn = document.createElement('button');
      btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
      btn.classList.add('btn', 'btn-primary');
      btn.onclick = () => addProductToCart(product.name, product.price);
      productsButtons.appendChild(btn);
    });
}

// Función para añadir un producto
addProductBtn.addEventListener('click', () => {
  const productName = productNameInput.value.trim();
  const productPrice = parseFloat(productPriceInput.value);
  const categoryIndex = parseInt(categorySelect.value);

  if (productName && !isNaN(productPrice) && categoryIndex >= 0) {
    products.push({ name: productName, price: productPrice, categoryIndex });
    productNameInput.value = '';
    productPriceInput.value = '';
    renderProducts();
  }
});

// Función para editar un producto
function editProduct(index) {
  const product = products[index];
  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  categorySelect.value = product.categoryIndex;

  deleteProduct(index);
}

// Función para eliminar un producto
function deleteProduct(index) {
  products.splice(index, 1);
  renderProducts();
}

// Función para agregar un producto al ticket
function addProductToCart(productName, productPrice) {
  cart.push({ name: productName, price: productPrice, quantity: 1 });
  updateTicket();
}

// Función para actualizar el ticket
function updateTicket() {
  ticketItems.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');

    const productNameSpan = document.createElement('span');
    productNameSpan.textContent = `${item.name}`;

    const productPriceSpan = document.createElement('span');
    productPriceSpan.textContent = `${item.price.toFixed(2)} €`;

    li.appendChild(productNameSpan);
    li.appendChild(productPriceSpan);
    ticketItems.appendChild(li);

    total += item.price;
  });

  totalAmount.textContent = `${total.toFixed(2)} €`;
}

// Función para limpiar el ticket
clearTicketBtn.addEventListener('click', () => {
  cart = [];
  updateTicket();
});

// Exportar datos a un archivo JSON
exportDataBtn.addEventListener('click', () => {
  const data = {
    categories: categories,
    products: products
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tpv_data.json';
  a.click();

  URL.revokeObjectURL(url);
  alert('Datos exportados correctamente.');
});

// Importar datos desde un archivo JSON
importFileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        categories = data.categories || [];
        products = data.products || [];
        renderCategories();
        renderProducts();
        saveToLocalStorage();
        alert('Datos importados correctamente. Los datos locales han sido sobrescritos.');
      } catch (error) {
        alert('Error al importar el archivo JSON. Asegúrate de que el archivo sea válido.');
      }
    };

    reader.readAsText(file);
  }
});

// Función para imprimir el ticket
printTicketBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert('No hay productos en el ticket para imprimir.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Detalles del ticket
  const date = new Date();
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  const ticketDetails = `Ticket #${ticketNumber}\nFecha: ${formattedDate}\n\n`;

  let yOffset = 20;
  doc.setFontSize(18);
  doc.text('Ticket de Venta', 10, 10);

  doc.setFontSize(12);
  doc.text(ticketDetails, 10, yOffset);
  yOffset += 20;

  cart.forEach((item) => {
    doc.text(`${item.name} - ${item.price.toFixed(2)} €`, 10, yOffset);
    yOffset += 10;
  });

  doc.setFontSize(14);
  doc.text(`Total: ${totalAmount.textContent}`, 10, yOffset + 10);

  doc.autoPrint();
  doc.output('dataurlnewwindow');

  ticketNumber++;
});

// Cargar datos al iniciar la aplicación
loadFromLocalStorage();