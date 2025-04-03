// Variables globales
const categoriesList = document.getElementById('categories-list');
const categoryInput = document.getElementById('category-input');
const addCategoryBtn = document.getElementById('add-category');

const categorySelect = document.getElementById('category-select');
const subcategoryInput = document.getElementById('subcategory-input');
const addSubcategoryBtn = document.getElementById('add-subcategory');
const subcategoriesList = document.getElementById('subcategories-list');

const productCategorySelect = document.getElementById('product-category-select');
const productSubcategorySelect = document.getElementById('product-subcategory-select');
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
const resetDataBtn = document.getElementById('reset-data');

// Nuevo modal para subcategorías
const subcategoryModal = document.getElementById('subcategory-modal');
const subcategoryOptions = document.getElementById('subcategory-options');

// Menú hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const menuOptions = document.getElementById('menu-options');

let categories = [];
let cart = [];
let ticketNumber = 1;

// Cargar datos
function loadFromLocalStorage() {
  const savedData = localStorage.getItem('tpv_data');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      categories = parsedData.categories || [];
      // Inicializar propiedades faltantes
      categories.forEach(category => {
        category.products = category.products || [];
        if (category.subcategories) {
          category.subcategories.forEach(subcategory => {
            subcategory.products = subcategory.products || [];
          });
        }
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      categories = [];
    }
  } else {
    categories = [];
  }
  renderAll();
}

// Guardar datos
function saveToLocalStorage() {
  localStorage.setItem('tpv_data', JSON.stringify({ categories }));
}

// Función para renderizar todo
function renderAll() {
  renderCategories();
  renderSubcategories();
  renderProducts();
  renderCategoriesButtons();
  filterProductsByCategory(0); // Filtrar productos por la primera categoría
}

// Renderizar categorías
function renderCategories() {
  categoriesList.innerHTML = '';
  categorySelect.innerHTML = '';
  productCategorySelect.innerHTML = '';

  categories.forEach((category, catIndex) => {
    // Elemento en lista de gestión
    const li = document.createElement('li');
    li.dataset.index = catIndex;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = category.name;
    input.classList.add('input-field');
    input.onblur = () => updateCategory(catIndex, input.value);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.onclick = () => deleteCategory(catIndex);

    li.appendChild(input);
    li.appendChild(deleteBtn);
    categoriesList.appendChild(li);

    // Opciones en selectores
    const option = document.createElement('option');
    option.value = catIndex;
    option.textContent = category.name;
    categorySelect.appendChild(option);
    productCategorySelect.appendChild(option.cloneNode(true));
  });
}

// Renderizar subcategorías
function renderSubcategories() {
  subcategoriesList.innerHTML = '';
  productSubcategorySelect.innerHTML = '<option value="">Sin subcategoría</option>';

  const selectedCatIndex = categorySelect.value;
  if (selectedCatIndex === '') return;

  const category = categories[selectedCatIndex];
  if (!category.subcategories) return;

  category.subcategories.forEach((subcategory, subIndex) => {
    // Elemento en lista de gestión
    const li = document.createElement('li');
    li.dataset.index = subIndex;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = subcategory.name;
    input.classList.add('input-field');
    input.onblur = () => updateSubcategory(selectedCatIndex, subIndex, input.value);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Eliminar';
    deleteBtn.classList.add('btn', 'btn-danger');
    deleteBtn.onclick = () => deleteSubcategory(selectedCatIndex, subIndex);

    li.appendChild(input);
    li.appendChild(deleteBtn);
    subcategoriesList.appendChild(li);

    // Opción en selector de subcategorías
    const option = document.createElement('option');
    option.value = subIndex;
    option.textContent = subcategory.name;
    productSubcategorySelect.appendChild(option);
  });
}

// Renderizar productos
function renderProducts() {
  productsList.innerHTML = '';
  productsButtons.innerHTML = '';

  categories.forEach((category, catIndex) => {
    // Productos sin subcategoría
    category.products?.forEach((product, prodIndex) => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - ${product.price.toFixed(2)} € (${category.name})`;
      li.dataset.catIndex = catIndex;
      li.dataset.prodIndex = prodIndex;

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Editar';
      editBtn.classList.add('btn', 'btn-secondary');
      editBtn.onclick = () => editProduct(catIndex, null, prodIndex);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.classList.add('btn', 'btn-danger');
      deleteBtn.onclick = () => deleteProduct(catIndex, null, prodIndex);

      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      productsList.appendChild(li);

      // Botón en pantalla principal
      const btn = document.createElement('button');
      btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
      btn.classList.add('btn', 'btn-primary');
      btn.onclick = () => addProductToCart(product.name, product.price);
      productsButtons.appendChild(btn);
    });

    // Productos con subcategoría
    category.subcategories?.forEach((subcategory, subIndex) => {
      subcategory.products?.forEach((product, prodIndex) => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - ${product.price.toFixed(2)} € (${category.name} > ${subcategory.name})`;
        li.dataset.catIndex = catIndex;
        li.dataset.subIndex = subIndex;
        li.dataset.prodIndex = prodIndex;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'btn-secondary');
        editBtn.onclick = () => editProduct(catIndex, subIndex, prodIndex);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.classList.add('btn', 'btn-danger');
        deleteBtn.onclick = () => deleteProduct(catIndex, subIndex, prodIndex);

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        productsList.appendChild(li);

        // Botón en pantalla principal
        const btn = document.createElement('button');
        btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
        btn.classList.add('btn', 'btn-primary');
        btn.onclick = () => addProductToCart(product.name, product.price);
        productsButtons.appendChild(btn);
      });
    });
  });
}

// Renderizar botones de categorías
function renderCategoriesButtons() {
  categoriesButtons.innerHTML = '';

  if (categories.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No hay categorías disponibles';
    message.style.color = '#6c757d';
    categoriesButtons.appendChild(message);
    return;
  }

  categories.forEach((category, catIndex) => {
    const btn = document.createElement('button');
    btn.textContent = category.name;
    btn.classList.add('btn', 'btn-primary');
    btn.onclick = () => handleCategoryClick(catIndex);
    categoriesButtons.appendChild(btn);
  });
}

// Manejar clic en categoría
function handleCategoryClick(catIndex) {
  const category = categories[catIndex];

  if (!category) {
    console.error(`Categoría con índice ${catIndex} no encontrada`);
    return;
  }

  if (category.subcategories && category.subcategories.length > 0) {
    // Mostrar modal de subcategorías
    subcategoryOptions.innerHTML = '';
    category.subcategories.forEach((subcategory, subIndex) => {
      const btn = document.createElement('button');
      btn.textContent = subcategory.name;
      btn.classList.add('btn', 'btn-primary');
      btn.onclick = () => {
        subcategoryModal.style.display = 'none';
        filterProductsByCategory(catIndex, subIndex);
      };
      subcategoryOptions.appendChild(btn);
    });
    subcategoryModal.style.display = 'block';
  } else {
    // Mostrar productos directamente
    filterProductsByCategory(catIndex);
  }
}

// Filtrar productos por categoría y subcategoría
function filterProductsByCategory(catIndex, subIndex = null) {
  const category = categories[catIndex];
  if (!category) {
    console.error(`Categoría con índice ${catIndex} no encontrada`);
    return;
  }

  productsButtons.innerHTML = '';

  let productsToShow = [];

  if (subIndex === null) {
    // Mostrar productos sin subcategoría
    productsToShow = category.products || [];
  } else {
    // Mostrar productos de la subcategoría
    const subcategory = category.subcategories?.[subIndex];
    if (!subcategory) {
      console.error(`Subcategoría con índice ${subIndex} no encontrada en categoría ${catIndex}`);
      return;
    }
    productsToShow = subcategory.products || [];
  }

  productsToShow.forEach(product => {
    const btn = document.createElement('button');
    btn.textContent = `${product.name} - ${product.price.toFixed(2)} €`;
    btn.classList.add('btn', 'btn-primary');
    btn.onclick = () => addProductToCart(product.name, product.price);
    productsButtons.appendChild(btn);
  });

  if (productsButtons.innerHTML === '') {
    const message = document.createElement('p');
    message.textContent = 'No hay productos disponibles';
    message.style.color = '#6c757d';
    productsButtons.appendChild(message);
  }
}

// Añadir categoría
addCategoryBtn.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (categoryName) {
    categories.push({
      name: categoryName,
      subcategories: [],
      products: []
    });
    categoryInput.value = '';
    saveToLocalStorage();
    renderAll();
  }
});

// Añadir subcategoría
addSubcategoryBtn.addEventListener('click', () => {
  const subcategoryName = subcategoryInput.value.trim();
  const selectedCatIndex = categorySelect.value;

  if (subcategoryName && selectedCatIndex !== '') {
    const category = categories[selectedCatIndex];
    if (!category.subcategories) {
      category.subcategories = [];
    }
    category.subcategories.push({
      name: subcategoryName,
      products: []
    });
    subcategoryInput.value = '';
    saveToLocalStorage();
    renderAll();
  }
});

// Añadir producto
addProductBtn.addEventListener('click', () => {
  const name = productNameInput.value.trim();
  const price = parseFloat(productPriceInput.value);
  const catIndex = productCategorySelect.value;
  const subIndex = productSubcategorySelect.value;

  if (!name || isNaN(price) || price <= 0) {
    alert('Nombre y precio válidos requeridos');
    return;
  }

  if (catIndex === '') {
    alert('Selecciona una categoría');
    return;
  }

  const category = categories[catIndex];
  const product = { name, price };

  if (subIndex === '') {
    // Añadir a la categoría directamente
    if (!category.products) category.products = [];
    category.products.push(product);
  } else {
    // Añadir a la subcategoría
    const subcategory = category.subcategories?.[subIndex];
    if (!subcategory) {
      alert('Subcategoría inválida');
      return;
    }
    if (!subcategory.products) {
      subcategory.products = [];
    }
    subcategory.products.push(product);
  }

  productNameInput.value = '';
  productPriceInput.value = '';
  saveToLocalStorage();
  renderAll();
});

// Eliminar categoría
function deleteCategory(catIndex) {
  categories.splice(catIndex, 1);
  saveToLocalStorage();
  renderAll();
}

// Eliminar subcategoría
function deleteSubcategory(catIndex, subIndex) {
  const category = categories[catIndex];
  if (!category.subcategories) return;
  category.subcategories.splice(subIndex, 1);
  saveToLocalStorage();
  renderAll();
}

// Eliminar producto
function deleteProduct(catIndex, subIndex, prodIndex) {
  const category = categories[catIndex];
  if (!category) return;

  if (subIndex === null) {
    if (!category.products) return;
    category.products.splice(prodIndex, 1);
  } else {
    const subcategory = category.subcategories?.[subIndex];
    if (!subcategory) return;
    if (!subcategory.products) return;
    subcategory.products.splice(prodIndex, 1);
  }
  saveToLocalStorage();
  renderAll();
}

// Editar producto
function editProduct(catIndex, subIndex, prodIndex) {
  const category = categories[catIndex];
  if (!category) return;

  const product = subIndex === null 
    ? category.products?.[prodIndex]
    : category.subcategories?.[subIndex]?.products?.[prodIndex];

  if (!product) {
    console.error(`Producto no encontrado en categoría ${catIndex}, subcategoría ${subIndex}, producto ${prodIndex}`);
    return;
  }

  productNameInput.value = product.name;
  productPriceInput.value = product.price;
  productCategorySelect.value = catIndex;
  productSubcategorySelect.value = subIndex || '';

  deleteProduct(catIndex, subIndex, prodIndex);
}

// Resto de funciones (ticket, import/export, etc.)
function addProductToCart(name, price) {
  cart.push({ name, price });
  updateTicket();
}

function updateTicket() {
  ticketItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.name}</span> <span>${item.price.toFixed(2)} €</span>`;
    ticketItems.appendChild(li);
    total += item.price;
  });

  totalAmount.textContent = total.toFixed(2) + ' €';
}

clearTicketBtn.addEventListener('click', () => {
  cart = [];
  updateTicket();
});

printTicketBtn.addEventListener('click', () => {
  if (cart.length === 0) return;

  const doc = new jspdf.jsPDF();
  doc.text('Ticket de Compra', 10, 10);
  doc.text(`Fecha: ${new Date().toLocaleString()}`, 10, 20);
  doc.text('----------------------------------------', 10, 30);

  let yPos = 40;
  let total = 0;

  cart.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name} - ${item.price.toFixed(2)} €`, 10, yPos);
    yPos += 10;
    total += item.price;
  });

  doc.text('----------------------------------------', 10, yPos);
  yPos += 10;
  doc.text(`Total: ${total.toFixed(2)} €`, 10, yPos);
  doc.save(`ticket_${ticketNumber++}.pdf`);
});

// Modal
openModalBtn.addEventListener('click', () => modal.style.display = 'block');
[closeModalBtn, closeIcon].forEach(btn => 
  btn.addEventListener('click', () => modal.style.display = 'none')
);

// Cerrar modal de subcategorías
document.querySelectorAll('#subcategory-modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', () => {
    subcategoryModal.style.display = 'none';
  });
});

// Exportar datos
exportDataBtn.addEventListener('click', () => {
  const data = JSON.stringify({ categories }, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tpv_data.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Importar datos
importFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsedData = JSON.parse(e.target.result);
        categories = parsedData.categories || [];
        // Inicializar propiedades faltantes
        categories.forEach(category => {
          category.products = category.products || [];
          if (category.subcategories) {
            category.subcategories.forEach(subcategory => {
              subcategory.products = subcategory.products || [];
            });
          }
        });
        saveToLocalStorage();
        renderAll();
        alert('Datos importados');
      } catch (error) {
        alert('Archivo inválido');
      }
    };
    reader.readAsText(file);
  }
});

// Reiniciar datos
resetDataBtn.addEventListener('click', () => {
  if (confirm('¿Reiniciar todo?')) {
    localStorage.removeItem('tpv_data');
    categories = [];
    cart = [];
    renderAll();
    updateTicket();
  }
});

// Menú hamburguesa
menuToggle.addEventListener('click', () => {
  menuOptions.classList.toggle('show');
});

// Inicializar
loadFromLocalStorage();