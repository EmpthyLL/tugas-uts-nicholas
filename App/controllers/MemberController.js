const Controller = require("./Controller");

class MemberController extends Controller {
  constructor() {
    super();
    this.view = "purchase/becomeMember";
    this.layout = "layout";
    this.title = "Join Membership";
  }

  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,

        cart: this.user.cart,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering top up page:", error);
      this.handleError(res, "Failed to render top up page", 500);
    }
  }
  month(req, res) {
    this.user = getAuthUser(req, res, false);
    if (this.user.member) {
      res.redirect("/");
    }
    const price = req.body.price;

    if (!cekBalance(this.user, price, req, res)) return;

    this.model.joinMember(req.uuid, Number(price));
    res.redirect("/");
  }
  year(req, res) {
    this.user = getAuthUser(req, res, false);

    if (this.user.member) {
      return res.redirect("/");
    }

    const price = req.body.price;

    if (!cekBalance(this.user, price, req, res)) return;

    this.model.joinMember(req.userid, Number(price), "yearly");
    res.redirect("/");
  }
}

module.exports = MemberController;
