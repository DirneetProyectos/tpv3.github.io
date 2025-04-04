export function updateTicket(cart, ticketItems, totalAmount) {
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