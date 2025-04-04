export function renderCategories(categories, categoriesList, categorySelect, productCategorySelect) {
  categoriesList.innerHTML = '';
  categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';
  productCategorySelect.innerHTML = '<option value="">Selecciona una categoría</option>';

  categories.forEach((category, catIndex) => {
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

    const option = document.createElement('option');
    option.value = catIndex;
    option.textContent = category.name;
    categorySelect.appendChild(option);
    productCategorySelect.appendChild(option.cloneNode(true));
  });
}

function updateCategory(index, newName) {
  // Lógica para actualizar categoría
}

function deleteCategory(index) {
  // Lógica para eliminar categoría
}