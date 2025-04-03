// Variables globales
const categoriesList = document.getElementById('categories-list');
const categoryInput = document.getElementById('category-input');
const addCategoryBtn = document.getElementById('add-category');

const categorySelect = document.getElementById('category-select');
const subcategoryInput = document.getElementById('subcategory-input');
const addSubcategoryBtn = document.getElementById('add-subcategory');
const subcategoriesList = document.getElementById('subcategories-list');

const subcategorySelect = document.getElementById('subcategory-select');
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
let cart = [];
let ticketNumber = 1;

// Cargar datos desde localStorage
function loadFromLocalStorage() {
  const savedData = localStorage.getItem('tpv_data');
  if (savedData) {
    const data = JSON.parse(savedData);
    categories = data.categories || [];
    renderCategories();
    renderSubcategories();
    renderProducts();
  }
}

// Guardar datos en localStorage
function saveToLocalStorage() {
  const data = { categories };
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

// Función para renderizar categorías
function renderCategories() {
  categoriesList.innerHTML = '';
  categorySelect.innerHTML = '';

  categories.forEach((category, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = category.name;
    input.classList.add('input-field');
    input.onblur = () => updateCategoryName(index, input.value);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.onclick = () => deleteCategory(index);

    li.appendChild(input);
    li.appendChild(deleteBtn);
    categoriesList.appendChild(li);

    const option = document.createElement('option');
    option.value = index;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });

  saveToLocalStorage();
}

// Función para actualizar el nombre de una categoría
function updateCategoryName(index, newName) {
  categories[index].name = newName.trim();
  renderCategories();
}

// Función para eliminar una categoría
function deleteCategory(index) {
  categories.splice(index, 1);
  renderCategories();
  renderSubcategories();
}

// Función para añadir una categoría
addCategoryBtn.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (categoryName) {
    categories.push({ name: categoryName, subcategories: [] });
    categoryInput.value = '';
    renderCategories();
  }
});

// Función para renderizar subcategorías
function renderSubcategories() {
  subcategoriesList.innerHTML = '';
  subcategorySelect.innerHTML = '';

  const selectedCategoryIndex = categorySelect.value;
  if (selectedCategoryIndex === '') return;

  const selectedCategory = categories[selectedCategoryIndex];
  selectedCategory.subcategories.forEach((subcategory, index) => {
    const li = document.createElement('li');
    li.dataset.index = index;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = subcategory.name;
    input.classList.add('input-field');
    input.onblur = () => updateSubcategoryName(selectedCategoryIndex, index, input.value);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.onclick = () => deleteSubcategory(selectedCategoryIndex, index);

    li.appendChild(input);
    li.appendChild(deleteBtn);
    subcategoriesList.appendChild(li);

    const option = document.createElement('option');
    option.value = `${selectedCategoryIndex}-${index}`;
    option.textContent = subcategory.name;
    subcategorySelect.appendChild(option);
  });

  saveToLocalStorage();
}

// Función para actualizar el nombre de una subcategoría
function updateSubcategoryName(categoryIndex, subcategoryIndex, newName) {
  categories[categoryIndex].subcategories[subcategoryIndex].name = newName.trim();
  renderSubcategories();
}

// Función para eliminar una subcategoría
function deleteSubcategory(categoryIndex, subcategoryIndex) {
  categories[categoryIndex].subcategories.splice(subcategoryIndex, 1);
  renderSubcategories();
}

// Función para añadir una subcategoría
addSubcategoryBtn.addEventListener('click', () => {
  const subcategoryName = subcategoryInput.value.trim();
  const selectedCategoryIndex = categorySelect.value;

  if (subcategoryName && selectedCategoryIndex !== '') {
    categories[selectedCategoryIndex].subcategories.push({ name: subcategoryName });
    subcategoryInput.value = '';
    renderSubcategories();
  }
});

// Función para renderizar productos
function renderProducts() {
  productsList.innerHTML = '';
  productsButtons.innerHTML = '';

  categories.forEach((category, categoryIndex) => {
    category.subcategories.forEach((subcategory, subcategoryIndex) => {
      subcategory.products?.forEach((product, productIndex) => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - ${product.price.toFixed(2)} € (${category.name} > ${subcategory.name})`;
        li.dataset.categoryIndex = categoryIndex;
        li.dataset.subcategoryIndex = subcategoryIndex;
        li.dataset.productIndex = productIndex;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'btn-secondary');
        editBtn.onclick = () => editProduct(categoryIndex, subcategoryIndex, productIndex);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.onclick = () => deleteProduct(categoryIndex, subcategoryIndex, productIndex);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        productsList.appendChild(li);

        const btn = document.createElement('button');
        btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
        btn.classList.add('btn', 'btn-primary');
        btn.onclick = () => addProductToCart(product.name, product.price);
        productsButtons.appendChild(btn);
      });
    });
  });

  saveToLocalStorage();
}

// Función para filtrar productos por subcategoría
function filterProductsBySubcategory(categoryIndex, subcategoryIndex) {
  productsButtons.innerHTML = '';

  const subcategory = categories[categoryIndex]?.subcategories[subcategoryIndex];
  if (!subcategory) return;

  subcategory.products?.forEach(product => {
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
  const [categoryIndex, subcategoryIndex] = subcategorySelect.value.split('-').map(Number);

  if (productName && !isNaN(productPrice) && categoryIndex >= 0 && subcategoryIndex >= 0) {
    if (!categories[categoryIndex].subcategories[subcategoryIndex].products) {
      categories[categoryIndex].subcategories[subcategoryIndex].products = [];
    }
    categories[categoryIndex].subcategories[subcategoryIndex].products.push({ name: productName, price: productPrice });
    productNameInput.value = '';
    productPriceInput.value = '';
    renderProducts();
  }
});

// Función para editar un producto
function editProduct(categoryIndex, subcategoryIndex, productIndex) {
  const product = categories[categoryIndex].subcategories[subcategoryIndex].products[productIndex];
  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  subcategorySelect.value = `${categoryIndex}-${subcategoryIndex}`;

  deleteProduct(categoryIndex, subcategoryIndex, productIndex);
}

// Función para eliminar un producto
function deleteProduct(categoryIndex, subcategoryIndex, productIndex) {
  categories[categoryIndex].subcategories[subcategoryIndex].products.splice(productIndex, 1);
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
  const data = { categories };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'tpv_data.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Importar datos desde un archivo JSON
importFileInput.addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        categories = data.categories || [];
        renderCategories();
        renderSubcategories();
        renderProducts();
        alert('Datos importados exitosamente.');
      } catch (error) {
        alert('Error al importar los datos. Asegúrate de que el archivo sea válido.');
      }
    };
    reader.readAsText(file);
  }
});

// Imprimir ticket usando jsPDF
printTicketBtn.addEventListener('click', () => {
  const doc = new jspdf.jsPDF();

  doc.text('Ticket de Compra', 10, 10);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 20);
  doc.text('----------------------------------------', 10, 30);

  let yPos = 40;
  let total = 0;

  cart.forEach((item, index) => {
    doc.text(`${item.name} - ${item.price.toFixed(2)} €`, 10, yPos);
    yPos += 10;
    total += item.price;
  });

  doc.text('----------------------------------------', 10, yPos);
  yPos += 10;
  doc.text(`Total: ${total.toFixed(2)} €`, 10, yPos);

  doc.save(`ticket-${ticketNumber++}.pdf`);
});

// Cargar datos al iniciar
loadFromLocalStorage();
