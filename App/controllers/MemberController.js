const notifModel = require("../../database/model/notifModel");
const userModel = require("../../database/model/userModel");
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
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering top up page:", error);
      this.handleError(res, "Failed to render top up page", 500);
    }
  }
  async becomeMember(req, res) {
    const is_member = await userModel.cekMemberStatus(req.cookies.userId);
    if (is_member) {
      return res.status(401).json({ message: "User is already a member." });
    }
    const price = req.body.price;
    const balance = await userModel.cekBalance(req.cookies.userId);
    if (price > balance) {
      return res.status(400).json({
        message: "Oh no! Your balance is not enough to become a member.",
      });
    }

    const until = await userModel.becomeMember(
      req.cookies.userId,
      price,
      req.params.type
    );

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(until));

    const message = {
      title: `!`,
      body: `You are now a member until ${formattedDate}. Enjoy your benefits!`,
      navigate: "/profile",
      category: "payment",
      type: "welcomemember",
    };
    await notifModel.addNotif(req.cookies.userId, message);
    return res.status(200).json({
      message: "Congratulation! You are now a member.",
    });
  }
}

module.exports = MemberController;
