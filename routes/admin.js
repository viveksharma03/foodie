var express = require("express");
const { LocalStorage } = require("node-localstorage");
var router = express.Router();
var db = require("./db");
var upload = require("./multer");
var localstorage = require("node-localstorage").localstorage;

localstorage = new LocalStorage("./adminscratch");

router.get("/error", function (req, res) {
  res.render("bigError");
});

/*
router.get("/signup", function (req, res) {
  try {
    res.render("adminSignup", { message: "", messageError: "" });
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.post("/signedup", function (req, res) {
  try {
    db.query(
      "insert into adminlogin (adminname, adminemail, admincontact, adminpassword) values(?, ?, ?, ?)",
      [
        req.body.adminname,
        req.body.adminemail,
        req.body.admincontact,
        req.body.adminpassword,
      ],
      function (error, result) {
        if (error) {
          res.render("adminSignup", {
            message: "",
            messageError: "Server Error",
          });
        } else {
          res.render("adminSignup", {
            message: "Account Created Successfully",
            messageError: "",
          });
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});
*/

router.get("/signin", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignin", { msg: "" });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.post("/checkadmin", function (req, res) {
  try {
    db.query(
      "select * from adminlogin where (adminemail = ? or admincontact = ?) and adminpassword = ?",
      [req.body.adminemail, req.body.admincontact, req.body.adminpassword],
      function (error, result) {
        if (error) {
          res.render("adminSignin", { msg: "Server Error" });
        } else {
          if (result.length === 1) {
            localstorage.setItem("token", JSON.stringify(result[0]));
            res.redirect("/admin/dashboard");
          } else {
            res.render("adminSignin", {
              msg: "Invalid Email/Contact or Password",
            });
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/signin");
  }
});

router.get("/forgotpassword", function (req, res) {
  try {
    res.render("forgotPassword");
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/signout", function (req, res) {
  var admin = JSON.parse(localstorage.getItem("token"));
  localstorage.removeItem("token");

  try {
    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      res.redirect("/admin/signin");
    }
  } catch (error) {
    res.redirect("/admin/error");
  }
});

router.get("/myprofile", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.redirect("/");
    } else {
      if (admin === null) {
        res.render("adminProfile", { admin: null });
      } else {
        res.render("adminProfile", { admin: admin });
      }
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/editAdminProfile", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.redirect("/");
    } else {
      db.query(
        "update adminlogin set adminname = ?, adminemail = ?, admincontact = ?, adminpassword = ? where adminid = ?",
        [
          req.query.adminname,
          req.query.adminemail,
          req.query.admincontact,
          req.query.adminpassword,
          req.query.adminid,
        ],
        function (error, result) {
          if (error) {
            res.status(500).json({
              message: "Server Error...",
            });
          } else {
            res.redirect("/");
            localstorage.removeItem("token");
          }
        }
      );
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

/*
router.get("/deleteAdminProfile", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.redirect("/");
    } else {
      db.query(
        "delete from adminlogin where adminid = ?",
        [req.query.adminid],
        function (error, result) {
          if (error) {
            res.status(500).json({
              message: "Server Error...",
            });
          } else {
            res.redirect("/");
            localstorage.removeItem("token");
          }
        }
      );
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});
*/

/* GET home page. */
router.get("/dashboard", function (req, res) {
  try {
    var query =
      "select count(*) as countCategory from foodcategory; select count(*) as countSubCategory from foodsubcategory; select count(*) as countTotalItems from fooditems; select count(*) as countTotalUsers from userlogin";

    db.query(query, function (error, result) {
      var admin = JSON.parse(localstorage.getItem("token"));

      if (admin === null) {
        res.render("adminSignIn", { msg: "Don't need to do that" });
      } else {
        if (error) {
          res.render("dashboard", { status: false, result: [] });
        } else {
          res.render("dashboard", {
            status: true,
            result: result,
            admin: admin,
          });
        }
      }
    });
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/add", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      res.render("addItem", { msg: "" });
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/fetch_all_types", function (req, res) {
  try {
    db.query("select * from type", function (error, result) {
      var admin = JSON.parse(localstorage.getItem("token"));
      if (admin === null) {
        res.render("adminSignIn", { msg: "Don't need to do that" });
      } else {
        if (error) {
          {
            res.status(500).json([]);
          }
        } else {
          res.status(200).json({
            types: result,
          });
        }
      }
    });
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/signin");
  }
});

router.get("/fetch_all_categories", function (req, res) {
  try {
    db.query("select * from foodcategory", function (error, result) {
      var admin = JSON.parse(localstorage.getItem("token"));

      if (admin === null) {
        res.render("adminSignIn", { msg: "Don't need to do that" });
      } else {
        if (error) {
          {
            res.status(500).json([]);
          }
        } else {
          res.status(200).json({
            category: result,
          });
        }
      }
    });
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/signin");
  }
});

router.get("/fetch_all_subcategories", function (req, res) {
  try {
    db.query(
      "select * from foodsubcategory where foodcategoryid=?",
      [req.query.foodcategoryid],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            {
              res.status(500).json([]);
            }
          } else {
            res.status(200).json({
              subcategory: result,
            });
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/signin");
  }
});

router.post("/addItem", upload.any("picture"), function (req, res) {
  try {
    db.query(
      "insert into fooditems(name, foodcategoryid, foodsubcategoryid, type, price, offerprice, rating, picture) values(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.name,
        req.body.foodcategoryid,
        req.body.foodsubcategoryid,
        req.body.foodid,
        req.body.price,
        req.body.offerprice,
        req.body.rating,
        req.files[0].filename,
      ],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.render("addItem", { msg: "Server Error" });
          } else {
            res.redirect("/admin/add");
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/display", function (req, res) {
  try {
    db.query(
      "select P.*, (select C.foodcategoryname from foodcategory C where C.foodcategoryid=P.foodcategoryid) as categoryname,(select S.foodsubcategoryname from foodsubcategory S where S.foodsubcategoryid=P.foodsubcategoryid) as subcategoryname,(select B.type from type B where B.foodid=P.type) as typename from fooditems P",
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.render("display", {
              status: false,
              data: "Server Error...",
            });
          } else {
            if (result.length == 0) {
              res.render("display", {
                status: false,
                index: 0,
                data: "No Records Found !",
              });
            } else {
              res.render("display", {
                status: true,
                index: 0,
                data: result,
              });
            }
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/addCat", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    var query = "select * from foodcategory";

    db.query(query, function (error, result) {
      if (admin === null) {
        res.render("adminSignIn", { msg: "Don't need to do that" });
      } else {
        if (error) {
          res.render("addCategory", { data: null });
        } else {
          res.render("addCategory", { data: result });
        }
      }
    });
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/deleteCat", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      res.render("deleteCategory");
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.post("/addCategory", function (req, res) {
  try {
    db.query(
      "insert into foodcategory(foodcategoryname) values(?)",
      [req.body.foodcategoryname],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.redirect("/admin/addCat");
          } else {
            res.redirect("/admin/addCat");
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/addSubCat", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      res.render("addSubCategory");
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/deleteSubCat", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      res.render("deleteSubCategory");
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.post("/addSubCategory", function (req, res) {
  try {
    db.query(
      "insert into foodsubcategory(foodcategoryid, foodsubcategoryname) values(?, ?)",
      [req.body.foodcategoryid, req.body.foodsubcategoryname],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.redirect("/admin/addSubCat");
          } else {
            res.redirect("/admin/addSubCat");
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/editProduct", function (req, res) {
  try {
    db.query(
      "update fooditems set name=?, foodcategoryid=?, foodsubcategoryid=?, price=?, offerprice=?, rating=? where id = ?",
      [
        req.query.name,
        req.query.foodcategoryid,
        req.query.foodsubcategoryid,
        req.query.price,
        req.query.offerprice,
        req.query.rating,
        req.query.id,
      ],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.status(500).json({
              status: false,
              message: "Server Error...",
            });
          } else {
            res.status(200).json({
              status: true,
              message: "Record Successfully Modified!",
            });
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/deleteItem", function (req, res) {
  try {
    db.query(
      "delete from fooditems where id = ?",
      [req.query.id],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.status(500).json({
              status: false,
              message: "Server Error...",
            });
          } else {
            res.status(200).json({
              status: true,
              message: "Record Successfully Deleted!",
            });
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.post("/updatePicture", upload.any(), function (req, res) {
  try {
    db.query(
      "update fooditems set picture = ? where id = ?",
      [req.files[0].filename, req.body.id],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.status(500).json({ status: false, message: "Server Error" });
          } else {
            res
              .status(200)
              .json({ status: true, message: "Picture Updated Successfully" });
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/deleteCategory", function (req, res) {
  try {
    db.query(
      "delete from foodcategory where foodcategoryid = ?; delete from foodsubcategory where foodcategoryid = ?;delete from fooditems where foodcategoryid = ?",
      [
        req.query.foodcategoryid,
        req.query.foodcategoryid,
        req.query.foodcategoryid,
      ],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.redirect("/admin/deleteCat");
          } else {
            res.redirect("/admin/deleteCat");
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/deleteSubCategory", function (req, res) {
  try {
    db.query(
      "delete from foodsubcategory where foodsubcategoryid = ? and foodcategoryid = ?;delete from fooditems where foodsubcategoryid = ? and foodcategoryid = ?",
      [
        req.query.foodsubcategoryid,
        req.query.foodcategoryid,
        req.query.foodsubcategoryid,
        req.query.foodcategoryid,
      ],
      function (error, result) {
        var admin = JSON.parse(localstorage.getItem("token"));

        if (admin === null) {
          res.render("adminSignIn", { msg: "Don't need to do that" });
        } else {
          if (error) {
            res.redirect("/admin/deleteSubCat");
          } else {
            res.redirect("/admin/deleteSubCat");
          }
        }
      }
    );
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/registeredUsers", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      db.query("select * from userlogin", function (error, result) {
        if (error) {
          res.render("registeredUsers", {
            status: false,
            error: error,
            result: null,
            index: null,
          });
        } else {
          res.render("registeredUsers", {
            status: true,
            error: null,
            result: result,
            index: 0,
          });
        }
      });
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

router.get("/deleteUser", function (req, res) {
  try {
    var admin = JSON.parse(localstorage.getItem("token"));

    if (admin === null) {
      res.render("adminSignIn", { msg: "Don't need to do that" });
    } else {
      db.query(
        "delete from userlogin where userid = ?",
        [req.query.userid],
        function (error, result) {
          if (error) {
            res.status(500).json({
              message: "Server Error...",
            });
          } else {
            res.status(200).json({
              message: "User Deleted Successfully",
            });
          }
        }
      );
    }
  } catch (error) {
    localstorage.removeItem("token");
    res.redirect("/admin/error");
  }
});

module.exports = router;

// Bharat Sharma
// 09 Oct 2022
