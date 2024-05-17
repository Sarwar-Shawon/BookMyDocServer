/*
 * @copyRight by md sarwar hoshen.
 */
import Organizations from "../models/organization.js";
/*
 * Organizations.
 */
// add new organization to system
const createOrganization = async (req, res) => {
  try {
    let imgUrl = "";
    if (req.file?.filename) {
      imgUrl = req.file.filename;
    }
    const organization = new Organizations({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      img: imgUrl,
      active: req.body.active,
      addr: req.body.addr,
    });
    //save to db
    const saveData = await organization.save();
    //
    //return response
    res.status(200).json({
      success: true,
      message: "You've successfully added a new organization.",
      data: saveData
    });
  } catch (err) {
    //return err
    //console.log("errerrerr::", err);
    if (err.code == "11000") {
      res.status(500).json({
        success: false,
        error: "This organization name is already exists.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
// update organization
const updadteOrganization = async (req, res) => {
  try {
    let organization = await Organizations.findOne({ _id: req.body._id });
    if (!organization) {
      return res.status(400).json({
        success: false,
        error: "No organization found.",
      });
    }
    let imgUrl = "";
    if (req.file?.originalname) {
      imgUrl = req.file.filename;
    } else {
      imgUrl = req.body.img;
    }
    organization.name = req.body.name;
    organization.email = req.body.email;
    organization.phone = req.body.phone;
    organization.img = imgUrl;
    organization.active = req.body.active;
    organization.addr = req.body.addr;
    //save to db
    await organization.save();
    //return response
    res.status(200).json({
      success: true,
      message: "You've successfully updated organization information.",
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
//get organizations
const getOrganizations = async (req, res) => {
  try {
    // const skip =
    //   req.query.skip && /^\d+$/.test(req.query.skip)
    //     ? Number(req.query.skip)
    //     : 0;
    // const limit = 10;
    const organizations = await Organizations.find({});
    //
    res.status(200).json({
      success: true,
      data: organizations,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export {
  //
  createOrganization,
  getOrganizations,
  updadteOrganization
};
