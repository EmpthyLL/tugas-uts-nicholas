const { default: axios } = require("axios");
const Controller = require("./Controller");
const getAuthUser = require("../../utils/user");
const formatDate = require("../../utils/formateDate");
const CartModel = require("../../model/service/CartModel");
const HistoryModel = require("../../model/service/HistoryModel");
const cekBalance = require("../../utils/balance");
const UserModel = require("../../model/service/UserModel");

class CartController extends Controller {
  constructor() {
    super();
    this.view = "cart";
    this.layout = "layout";
    this.title = "Your Cart";
    this.user = {};
    this.model = new UserModel();
    this.cart = new CartModel();
    this.history = new HistoryModel();
  }

  async index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);

      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        keyword: "",
        user: this.user,
        formatDate,
        cart: this.user.cart,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render cart page", 500);
    }
  }

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { productId } = req.body;
      const { data } = await axios.get(
        `https://dummyjson.com/products/${productId}`
      );

      const newItem = {
        id: data.id,
        title: data.title,
        price: data.price,
        brand: data.brand || null,
        category: data.category,
        thumbnail: data.thumbnail,
        quantity: 1,
      };

      const user = getAuthUser(req, res, true);
      if (user) {
        await this.cart.addItem(user.uuid, newItem);
        res.status(200).json({ message: "Item added to cart", item: newItem });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to add item to cart", 500);
    }
  }

  // Increment item quantity in cart
  async incrementItem(req, res) {
    try {
      const { productId } = req.body;
      const user = getAuthUser(req, res, true);
      if (user) {
        const newQuantity = await this.cart.incrementItem(
          user.uuid,
          Number(productId)
        );
        res
          .status(200)
          .json({ message: "Item incremented", quantity: newQuantity });
      } else {
        return res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to increment item", 500);
    }
  }

  // Decrement item quantity in cart
  async decrementItem(req, res) {
    try {
      const { productId } = req.body;
      const user = getAuthUser(req, res, true);

      if (user) {
        const newQuantity = await this.cart.decrementItem(
          user.uuid,
          Number(productId)
        );
        res
          .status(200)
          .json({ message: "Item decremented", quantity: newQuantity });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to decrement item", 500);
    }
  }

  async getCartData(req, res) {
    try {
      const user = getAuthUser(req, res, true);
      if (user) {
        res
          .status(200)
          .json({ message: "Data has been retrive", data: user.cart });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to retrive items", 500);
    }
  }

  payment(req, res) {
    this.user = getAuthUser(req, res, false);

    const price = this.user.cart.total;

    if (!cekBalance(this.user, price, req, res)) return;

    this.model.pay(this.user.uuid, price);

    res.redirect(`/order`);
  }
}

module.exports = CartController;
