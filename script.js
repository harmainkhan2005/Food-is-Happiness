// Store cart in localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add to cart
function addToCart(item, price) {
  let found = cart.find(p => p.name === item);
  if (found) {
    found.qty++;
  } else {
    cart.push({ name: item, price: price, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(item + " added to cart!");
}

function loadCart() {
  let tbody = document.getElementById("cart-body");
  let totalTop = document.getElementById("cart-total-top");
  let totalBottom = document.getElementById("cart-total-bottom");

  if (!tbody) return;

  tbody.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    let row = document.createElement("tr");
    let subTotal = item.price * item.qty;
    total += subTotal;

    row.innerHTML = `
      <td>${item.name}</td>
      <td>₹${item.price}</td>
      <td>
        <button onclick="updateQty(${i},-1)">-</button>
        ${item.qty}
        <button onclick="updateQty(${i},1)">+</button>
      </td>
      <td>₹${subTotal}</td>
      <td><button onclick="removeItem(${i})">❌</button></td>
    `;
    tbody.appendChild(row);
  });

  if (totalTop) totalTop.textContent = "Total: ₹" + total;
  if (totalBottom) totalBottom.textContent = "Total: ₹" + total;
}

// Update quantity
function updateQty(i, change) {
  cart[i].qty += change;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Remove item
function removeItem(i) {
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Clear cart
function clearCart() {
  cart = [];
  localStorage.removeItem("cart");
  loadCart();
}

// Place order
function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let name = document.getElementById("cust-name").value.trim();
  let phone = document.getElementById("cust-phone").value.trim();
  let address = document.getElementById("cust-address").value.trim();

  if (!name || !phone || !address) {
    alert("Please fill all customer details!");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({
    date: new Date().toLocaleString(),
    customer: { name, phone, address },
    items: cart
  });
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Order placed successfully!");
  clearCart();
  window.location.href = "order-history.html";
}



// Export CSV
function exportCSV() {
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  let csv = "Item,Price,Quantity,Total\n";
  cart.forEach(item => {
    csv += `${item.name},${item.price},${item.qty},${item.price * item.qty}\n`;
  });

  let blob = new Blob([csv], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "cart.csv";
  a.click();
}

// Load order history
window.onload = function () {
  if (document.getElementById("cart-body")) loadCart();

  let orderList = document.getElementById("order-list");
  if (orderList) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.forEach(order => {
      let li = document.createElement("li");
      li.textContent = `${order.date} - ${order.items.length} items`;
      orderList.appendChild(li);
    });
  }
};
