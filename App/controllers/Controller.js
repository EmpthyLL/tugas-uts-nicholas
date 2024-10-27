const { data } = require("autoprefixer");
const fs = require("fs");
const path = require("path");
const { title } = require("process");

class BaseController {
  constructor() {
    this.menus = [
      {
        title: "Cart",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart text-white mr-1 hover:text-lime-400"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
        href: "/cart",
      },
      {
        title: "History",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-history text-white mr-1 hover:text-lime-400"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
        href: "/history",
      },
      {
        title: "Notification",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell text-white mr-1 hover:text-lime-400"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
      },
    ];
  }

  renderView(res, options) {
    const layoutPath = path.join(
      __dirname,
      "../../views/components",
      `${this.layout}.ejs`
    );
    const viewPath = path.join(__dirname, "../../views", `${this.view}.ejs`);

    try {
      if (!fs.existsSync(viewPath) || !fs.existsSync(layoutPath)) {
        throw new Error(`View "${this.view}" not found`);
      }

      res.render(this.view, options);
    } catch (error) {
      this.handleError(res, error.message);
    }
  }

  handleError(res, message = "Something went wrong", statusCode = 500) {
    res.status(statusCode);
    res.render("error/error", {
      layout: "error/error_view",
      title: `${statusCode} Something Went Wrong`,
      code: statusCode.toString(),
      message: `<b>Oh no!</b> ${message}`,
    });
  }
}

module.exports = BaseController;