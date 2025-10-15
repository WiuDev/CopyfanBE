const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const isAuthenticated = require("../middlewares/isAuth");

 router.post("/auth/register", UserController.createUser);
 router.post("/auth/login", LoginController.login);
 router.put("/users/me", isAuthenticated, UserController.updateUser);
// router.post("/order", isAuthenticated, OrderController.createOrder);
// router.get("/order/:UserId", isAuthenticated, OrderController.getOrdersByUser);
// router.post("/payment/process", isAuthenticated, PaymentController.processPayment);
// router.get("/materials", isAuthenticated, MaterialController.getAllMaterials);
// router.get("/support/upload", isAuthenticated, SupportController.generateUploadUrl);
// router.get("/admin/orders", isAuthenticated, isAdmin, AdminController.getAllOrders);
// router.get("/admin/orders/:id", isAuthenticated, isAdmin, AdminController.getOrderById);
// router.put("/admin/orders/:id/status", isAuthenticated, isAdmin, AdminController.updateOrderStatus);
// router.get("/admin/financial/report", isAuthenticated, isAdmin, AdminController.getFinancialReport);



router.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
