// مفتاح تخزين السلة في LocalStorage
const STORAGE_KEY = "dreamtime_cart";

/**
 * الحصول على السلة الحالية من LocalStorage
 */
function getCart() {
  const cartStr = localStorage.getItem(STORAGE_KEY);
  return cartStr ? JSON.parse(cartStr) : [];
}

/**
 * حفظ السلة في LocalStorage
 */
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/**
 * إضافة منتج إلى السلة
 */
function addToCart(productId) {
  const product = window.products.find(p => p.id === productId); // نستخدم products العالمي
  if (!product) return;

  let cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount(); // تحديث عدد العناصر في الشريط العلوي
  updateCartUI();   // تحديث واجهة السلة
}

/**
 * تغيير كمية منتج في السلة
 */
function changeQuantity(productId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart(cart);
    updateCartCount();
    updateCartUI();
  }
}

/**
 * حذف منتج من السلة
 */
function removeProductFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  updateCartCount();
  updateCartUI();
}

/**
 * تحديث عداد السلة (في الزر)
 */
function updateCartCount() {
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
  }
}

/**
 * تحديث واجهة السلة (عند فتح النافذة)
 */
function updateCartUI() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItemsContainer || !cartTotal) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <div>
        <img src="${item.image}" alt="${item.name}">
        <span class="cart-item-name">${item.name}</span>
      </div>
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
        <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
      </div>
      <div><span>ريال يمني ${Math.round(item.price * item.quantity)}</span></div>
    `;
    cartItemsContainer.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = "الإجمالي: ريال يمني " + Math.round(total);
}

/**
 * إرسال طلب عبر الواتساب
 */
function sendOrder() {
  const customerName = prompt("أدخل اسمك لاستلام البضاعة");
  const customerAddress = prompt("أدخل عنوانك لاستلام البضاعة");

  if (!customerName || !customerAddress) {
    alert("يرجى إدخال اسمك وعنوانك.");
    return;
  }

  const cart = getCart();
  let message = `🎉 طلب جديد من ${customerName}\n`;
  message += `📍 العنوان: ${customerAddress}\n`;
  message += `🛒 سلة التسوق:\n`;

  cart.forEach(item => {
    message += `- ${item.name} x${item.quantity} - ريال يمني ${Math.round(item.price * item.quantity)}\n`;
  });

  message += `\n💰 الإجمالي: ريال يمني ${Math.round(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))}`;

  const whatsappNumber = "+966567435548"; // ← قم بتحديث الرقم حسب رغبتك
  const url = `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
  window.location.href = url;
}

/**
 * تهيئة الأدوات عند تحميل الصفحة
 */
function initCartFunctions() {
  updateCartCount();
  updateCartUI();
}