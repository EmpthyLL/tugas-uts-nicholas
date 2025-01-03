const { Carts, CartItems } = require("../config/schema");
const userModel = require("./userModel");

const cartModel = {
  async getCart(id) {
    const cart = await Carts.findOne({
      where: { id, deleted_at: null },
    });
    return cart || [];
  },
  async getUserCart(uuid) {
    const { id } = await userModel.getUserByUUID(uuid);
    const cart = await Carts.findOne({
      where: { user_id: id, deleted_at: null },
    });
    return cart || [];
  },
  async getUserCartList(uuid) {
    const { id } = await userModel.getUserByUUID(uuid);
    const cart = await Carts.findOne({
      where: { user_id: id, deleted_at: null },
      order: [["created_at", "ASC"]],
      include: [{ model: CartItems, required: false }],
    });
    return cart || [];
  },
  async getCartItems(cart_id) {
    const cart = await CartItems.findAll({
      where: { cart_id },
      order: [["created_at", "ASC"]],
    });
    return cart || [];
  },
  async createCart(uuid) {
    const { id } = await userModel.getUserByUUID(uuid);
    await Carts.create({ user_id: id });
    const cart = await this.getCart(id);
    return cart.id;
  },
  async addItem(uuid, item) {
    const { item_id, title, price, brand, category, thumbnail } = item;
    const cart = await this.getCartList(id);
    if (!cart) {
      await this.createCart(uuid);
    }
    await CartItems.create({
      item_id,
      title,
      price,
      brand,
      category,
      thumbnail,
      total: price,
    });
  },
  async AddQuantity(itemId, is_member) {
    const cartItem = await CartItems.findOne({ where: { id: itemId } });
    const cart = await this.getCartList(cartItem.cart_id);
    cartItem.quantity += 1;
    cartItem.total = cartItem.quantity * cartItem.price;

    cart.cart_total += cartItem.quantity * cartItem.price;
    cart.tax = (cart.cart_total * 0.11).toFixed(2);
    cart.member_discount = is_member
      ? Number((cart.cart_total * 0.2).toFixed(2))
      : 0;
    cart.total = Number(
      (
        parseFloat(cart.cart_total) +
        parseFloat(cart.tax) -
        parseFloat(cart.member_discount)
      ).toFixed(2)
    );

    await cartItem.save();
    await cart.save();
  },
  async ReduceQuantity(itemId, is_member) {
    const cartItem = await CartItems.findOne({ where: { id: itemId } });
    const cart = await this.getCartList(cartItem.cart_id);
    cartItem.quantity -= 1;
    if (cartItem.quantity === 0) {
      await cartItem.destroy();
    }
    cartItem.total = cartItem.quantity * cartItem.price;

    cart.cart_total -= cartItem.quantity * cartItem.price;
    cart.tax = (cart.cart_total * 0.11).toFixed(2);
    cart.member_discount = is_member
      ? Number((cart.cart_total * 0.2).toFixed(2))
      : 0;
    cart.total = Number(
      (
        parseFloat(cart.cart_total) -
        parseFloat(cart.tax) +
        parseFloat(cart.member_discount)
      ).toFixed(2)
    );

    await cartItem.save();
    await cart.save();
  },
  async deleteCart(id) {
    await Carts.update({ deleted_at: new Date() }, { where: { id } });
  },
  async moveItemsToCart(id, items) {
    const insertArray = orderCartItems.map((item) => {
      const {
        item_id,
        title,
        price,
        brand,
        category,
        thumbnail,
        total,
        created_at,
        updated_at,
      } = item;
      CartItems.create({
        cart_id: cart.id,
        item_id,
        title,
        price,
        brand,
        category,
        thumbnail,
        total,
        created_at,
        updated_at,
      });
    });
    await Promise.all(insertArray);
  },
};

module.exports = cartModel;
