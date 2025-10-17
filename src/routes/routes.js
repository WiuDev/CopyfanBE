const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const MaterialController = require("../controllers/MaterialController");
const OrderController = require("../controllers/OrderController");
const ValueController = require("../controllers/ValueController");
const isAuthenticated = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const isTeacher = require("../middlewares/isTeacher")
const upload = require("../middlewares/upload");

 router.post("/auth/register", UserController.createUser);
 router.post("/auth/login", LoginController.login);
 router.get("/users/me", isAuthenticated, UserController.getUser);
 router.put("/users/me", isAuthenticated,  UserController.updateUser);
 router.post("/materials", isAuthenticated, upload.single("file"),MaterialController.createMaterial);
 router.get("/materials/:id", isAuthenticated, MaterialController.getMaterial);
 router.post("/order", isAuthenticated, OrderController.createOrder);
 router.post("/values", isAuthenticated, ValueController.createValue);
 router.put("/values/:id", isAuthenticated, isTeacher, ValueController.updateValue);
 router.get("/values", isAuthenticated, ValueController.getValue);
// router.put("/payment/process", isAuthenticated, PaymentController.statusPayment);
// router.get("/order/:UserId", isAuthenticated, OrderController.getOrdersByUser);
// router.get("/admin/orders", isAuthenticated, isAdmin, AdminController.getAllOrders);
// router.get("/admin/orders/:id", isAuthenticated, isAdmin, AdminController.getOrderById);
// router.put("/admin/orders/:id/status", isAuthenticated, isAdmin, AdminController.updateOrderStatus);
// router.get("/admin/financial/report", isAuthenticated, isAdmin, AdminController.getFinancialReport);



router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
