const { generateRefToken, generateAccToken } = require("../../utils/jwt");
const { Users } = require("../config/schema");
const { v4: uuidv4 } = require("uuid");

const userModel = {
  async getUserByUUID(uuid) {
    const user = await Users.findOne({ where: { uuid } });
    return user || null;
  },
  async getUserByPhone(no_hp) {
    const user = await Users.findOne({ where: { no_hp } });
    return user || null;
  },
  async getUserByEmail(email) {
    const user = await Users.findOne({ where: { email } });
    return user || null;
  },
  async register(fullname, no_hp, email) {
    const uuid = uuidv4();
    await Users.create({
      uuid,
      fullname,
      no_hp,
      email,
    });
    return await this.login(uuid);
  },
  async login(uuid) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    const {
      fullname,
      email,
      profile_pic,
      balance,
      status_member,
      member_since,
    } = user;

    const ref_token = generateRefToken({ uuid: user.uuid });
    const acc_token = generateAccToken({
      user: {
        uuid,
        fullname,
        email,
        profile_pic,
        balance,
        status_member,
        member_since,
      },
    });

    return { uuid, ref_token, acc_token };
  },
  async editBasicProfile(uuid, { profile_pic, fullname, gender, birth_date }) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }
    user.profile_pic = profile_pic || null;
    user.fullname = fullname || user.fullname;
    user.gender = gender || null;
    user.birth_date = birth_date || null;

    this.saveData();
  },
  async editEmail(uuid, newEmail) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    user.email = newEmail;
    this.saveData();
  },
  async editPhone(uuid, newPhone) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    user.no_hp = newPhone;
    this.saveData();
  },
  async cekBalance(uuid) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    return user.balance;
  },
  async purchase(uuid, price) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    user.balance -= price;
    user.save();
  },
  async topup(uuid, amount) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    user.balance += amount;
    user.save();
  },
  async cekMemberStatus(uuid) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    if (!user.is_member && !user.member_until) {
      return false;
    }

    const currentDate = new Date();
    const memberUntilDate = new Date(user.member_until);

    if (user.is_member && memberUntilDate < currentDate) {
      user.is_member = false;
      user.member_since = null;
      user.member_until = null;
      await user.save();
      return false;
    }

    return false;
  },
  async becomeMember(uuid, price, type) {
    const user = await this.getUserByUUID(uuid);
    if (!user) {
      return -1;
    }

    if (user.is_member || user.member_until) {
      return false;
    }

    user.member = true;
    user.member_since = new Date().toISOString();

    if (type === "monthly") {
      user.member_until = new Date(
        currentDate.setMonth(currentDate.getMonth() + 1)
      ).toISOString();
    } else if (durationType === "yearly") {
      user.member_until = new Date(
        currentDate.setFullYear(currentDate.getFullYear() + 1)
      ).toISOString();
    }

    user.save();
  },
};

module.exports = userModel;
