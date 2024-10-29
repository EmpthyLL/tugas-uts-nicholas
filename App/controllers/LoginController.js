const Controller = require("./Controller");

class LoginController extends Controller {
  constructor() {
    super();
    this.view = "login";
    this.layout = "plain";
    this.title = "Login Page";
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
  login() {
    //
  }
}

module.exports = LoginController;
