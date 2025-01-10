const loadingStates = {};

async function addToCart(productId, quantity) {
  if (loadingStates[productId]) return; // Prevent double-clicks

  try {
    loadingStates[productId] = true;
    toggleButtons(productId, true); // Disable buttons

    const response = await axios.post(`api/cart/add/${productId}`);
    if (response.status === 200 || quantity !== response.data.item.quantity) {
      updateCartDisplay(response.data.item.id, response.data.item.quantity);
    } else if (response.status === 403) {
      window.location.href = "/sign-in";
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  } finally {
    loadingStates[productId] = false;
    toggleButtons(productId, false); // Enable buttons
  }
}

async function increment(productId) {
  if (loadingStates[productId]) return; // Prevent double-clicks

  try {
    loadingStates[productId] = true;
    toggleButtons(productId, true);

    const response = await axios.post(`api/cart/increment/${productId}`);
    if (response.status === 200) {
      updateCartDisplay(productId, response.data.quantity);
    } else if (response.status === 403) {
      window.location.href = "/sign-in";
    }
  } catch (error) {
    console.error("Error incrementing item:", error);
  } finally {
    loadingStates[productId] = false;
    toggleButtons(productId, false);
  }
}

async function decrement(productId, quantity) {
  if (loadingStates[productId]) return;

  try {
    loadingStates[productId] = true;
    toggleButtons(productId, true);

    const response = await axios.post(`api/cart/decrement/${productId}`);
    if (response.status === 200 || quantity !== response.data.item.quantity) {
      updateCartDisplay(productId, response.data.quantity);
    } else if (response.status === 403) {
      window.location.href = "/sign-in";
    }
  } catch (error) {
    console.error("Error decrementing item:", error);
  } finally {
    loadingStates[productId] = false;
    toggleButtons(productId, false);
  }
}

function updateCartDisplay(productId, quantity) {
  if (quantity === undefined) {
    window.location.replace = "/sign-in";
    return false;
  }
  const quantityDisplay = document.getElementById(
    `quantity-display-${productId}`
  );
  quantityDisplay.innerText = quantity;

  UpdateCart();
  // If quantity is zero, revert to add button
  if (quantity <= 0) {
    const container = document.getElementById(`quantity-${productId}`);
    container.innerHTML = `
        <button
          onclick="addQuantity(event, '${productId}')"
          class="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center transition hover:bg-blue-600 shadow-md"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      `;
  }
}

function addQuantity(event, productId, quantity) {
  event.stopPropagation();
  addToCart(productId, quantity);
  UpdateCart();
  const container = document.getElementById(`quantity-${productId}`);
  container.innerHTML = `
      <div class="flex items-center space-x-2 bg-gray-100 p-1 rounded-full shadow-md">
        <button
          onclick="decreaseQuantity(event, '${productId}')"
          class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <!-- Minus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <span id="quantity-display-${productId}" class="text-gray-800 font-semibold">1</span>
        <button
          onclick="increaseQuantity(event, '${productId}')"
          class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <!-- Plus Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    `;
}

function increaseQuantity(event, productId, quantity) {
  event.stopPropagation();
  increment(productId, quantity);
  UpdateCart();
  updateShoppingCart();
}

function decreaseQuantity(event, productId, quantity) {
  event.stopPropagation();
  decrement(productId, quantity);
  UpdateCart();
  updateShoppingCart();
}

function toggleButtons(productId, disable) {
  const decrementButton = document.querySelector(
    `#quantity-${productId} button[onclick*="decreaseQuantity"]`
  );
  const incrementButton = document.querySelector(
    `#quantity-${productId} button[onclick*="increaseQuantity"]`
  );

  if (decrementButton) decrementButton.disabled = disable;
  if (incrementButton) incrementButton.disabled = disable;
}
async function UpdateCart() {
  try {
    const response = await axios("api/cart/view");
    const CartPop = document.getElementById("Cart-Pop");
    if (!response.data.cart || response.data.cart.items.length === 0) {
      CartPop.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    let navhtml = "";
    response.data.cart.items.forEach((item) => {
      navhtml += ` <a
                    href="/product/${item.id}"
                    class="flex gap-2 items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md  dark:border-gray-700"
                  >
                    <img
                      src="${item.thumbnail}"
                      alt="Product Image"
                      class="w-16 h-16 rounded-md object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <div class="flex-grow space-y-1">
                      <p
                        class="text-base font-semibold text-gray-900 dark:text-white"
                      >
                        ${item.title}
                      </p>
                      <p
                        class="text-xs text-gray-500 dark:text-gray-400 flex items-center"
                      >
                        <span
                          class="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded-full font-medium mr-2"
                        >
                          Qty: ${item.quantity}
                        </span>
                      </p>
                      <p
                        class="text-gray-800 dark:text-gray-200 font-bold text-lg whitespace-nowrap"
                      >
                        ${format(item.price)}
                      </p>
                    </div>
                  </a>`;
    });

    CartPop.innerHTML = navhtml;

    const shoppingBag = document.getElementById("shopping-bag");
    const subTotal = document.getElementById("subtotal");
    const tax = document.getElementById("tax");
    const memberDiscount = document.getElementById("member_discount");
    const total = document.getElementById("total");
    if (!response.data.cart || response.data.cart.items.length === 0) {
      shoppingBag.innerHTML = "<p>Your cart is currently empty.</p>";
      return;
    }
    subTotal.innerHTML = format(response.data.cart.cart_total);
    tax.innerHTML = format(response.data.cart.tax);
    memberDiscount.innerHTML = `- ${format(
      response.data.cart.member_discount
    )}`;
    total.innerHTML = format(response.data.cart.total);

    let carthtml = "";
    response.data.cart.items.forEach((item) => {
      carthtml += ` <div class="flex items-start border-b pb-4 mb-4" id="product-${item}">
    <a href="/product/${item.id}">
      <img
        src="${item.thumbnail}"
        alt="${item.title}"
        class="w-24 h-24 object-cover rounded-md mr-4"
      />
    </a>
    <div class="flex-1">
      <h3 class="font-semibold text-lg">${item.title}</h3>
      <p class="text-gray-500">
        Price: ${format(item.price)}
      </p>
      <p class="text-gray-500">Brand: ${item.brand || "-"}</p>
      <p class="text-gray-500">Category: ${item.category}</p>
    </div>
    <div class="flex flex-col items-end ml-6">
      <label class="text-gray-500">Quantity</label>
      <div id="quantity-${item.id}" class="flex items-end space-x-2">
        <div
          class="flex items-center space-x-2 bg-gray-100 p-1 rounded-full shadow-md"
        >
          <button
            onclick="decreaseQuantity(event, '${item.id}')"
            class="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="16"
              height="16"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 12H4"
              />
            </svg>
          </button>
          <span
            id="quantity-display-${item.id}"
            class="text-gray-800 font-semibold"
          >
            ${item.quantity}
          </span>
          <button
            onclick="increaseQuantity(event, '${item.id}')"
            class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="16"
              height="16"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
      <div class="mt-4">
        <a
          href="/product/${item.id}"
          class="text-blue-600 underline hover:text-blue-700 transition duration-300 ease-in-out"
        >
          View Details
        </a>
      </div>
      <div class="mt-4 font-bold text-lg">
        <p>${format(item.total)}</p>
      </div>
    </div>
  </div>`;
    });
    shoppingBag.innerHTML = carthtml;
  } catch (error) {
    console.error("Error updating cart:", error);
    // Optionally, show an error message to the user
    CartPop.innerHTML =
      "<p>Error loading cart items. Please try again later.</p>";
    shoppingBag.innerHTML =
      "<p>Error loading cart items. Please try again later.</p>";
  }
}

function format(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}
