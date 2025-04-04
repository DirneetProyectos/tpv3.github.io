import { renderCategories } from './modules/categories.js';
import { renderProducts } from './modules/products.js';
import { updateTicket } from './modules/ticket.js';
import { showModal, hideModal } from './modules/modal.js';
import { toggleMenu, closeMenu } from './modules/menu.js';
import { loadFromLocalStorage, saveToLocalStorage } from './modules/data.js';

document.addEventListener('DOMContentLoaded', () => {
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
  const closeModalBtn = document.querySelector('#management-modal .close');
  const modal = document.getElementById('management-modal');

  const exportDataBtn = document.getElementById('export-data');
  const importFileInput = document.getElementById('import-file');
  const printTicketBtn = document.getElementById('print-ticket');
  const resetDataBtn = document.getElementById('reset-data');

  // Menú hamburguesa
  const menuToggle = document.getElementById('menu-toggle');
  const menuOptions = document.getElementById('menu-options');

  let categories = [];
  let cart = [];

  // Cargar datos
  categories = loadFromLocalStorage();

  // Renderizar todo
  function renderAll() {
    renderCategories(categories, categoriesList, categorySelect, productCategorySelect);
    renderProducts(categories, productsButtons);
    updateTicket(cart, ticketItems, totalAmount);
  }

  // Eventos
  menuToggle.addEventListener('click', () => toggleMenu(menuOptions));
  document.querySelectorAll('.menu-option').forEach(option => {
    option.addEventListener('click', () => closeMenu(menuOptions));
  });

  openModalBtn.addEventListener('click', () => showModal(modal));
  closeModalBtn.addEventListener('click', () => hideModal(modal));

  clearTicketBtn.addEventListener('click', () => {
    cart = [];
    updateTicket(cart, ticketItems, totalAmount);
  });

  // Inicializar
  renderAll();
});