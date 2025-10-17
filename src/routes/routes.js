const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const MaterialController = require("../controllers/MaterialController");
const OrderController = require("../controllers/OrderController");
const ValueController = require("../controllers/ValueController");
const PaymentController = require("../controllers/PaymentController");
const isAuthenticated = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const isTeacher = require("../middlewares/isTeacher")
const upload = require("../middlewares/upload");


// WITHOUT AUTH
 router.post("/auth/register", UserController.createUser);
 router.post("/auth/login", LoginController.login);
 // WITH AUTH
 router.get("/users/me", isAuthenticated, UserController.getUser);
 router.put("/users/me", isAuthenticated,  UserController.updateUser);
 router.post("/materials", isAuthenticated, upload.single("file"),MaterialController.createMaterial);
 router.get("/materials/:id", isAuthenticated, MaterialController.getMaterial);
 router.post("/orders", isAuthenticated, OrderController.createOrder);
 router.post("/values", isAuthenticated, ValueController.createValue);
 router.get("/values", isAuthenticated, ValueController.getValue);
 router.get("/orders/:id", isAuthenticated, OrderController.getOrderById);
 router.get("/payments/:id", isAuthenticated, PaymentController.getPaymentDetails);

 //WITH ADMIN
 router.put("/values/:id", isAuthenticated, isAdmin, ValueController.updateValue);
 router.put("/orders/:id/status", isAuthenticated, isAdmin, OrderController.updateOrderStatus);
 router.get("/orders", isAuthenticated, isAdmin, OrderController.getAllOrders);
 router.get("/payments", isAuthenticated, isAdmin, PaymentController.getAllPayments);
// router.get("/orders/:UserId", isAuthenticated, OrderController.getOrdersByUser);
// router.get("/admin/orders", isAuthenticated, isAdmin, AdminController.getAllOrders);
// router.get("/admin/orders/:id", isAuthenticated, isAdmin, AdminController.getOrderById);
// router.put("/admin/orders/:id/status", isAuthenticated, isAdmin, AdminController.updateOrderStatus);
// router.get("/admin/financial/report", isAuthenticated, isAdmin, AdminController.getFinancialReport);



router.get("/", (req, res) => {
  res.send("COPYFAN!");
});

module.exports = router;