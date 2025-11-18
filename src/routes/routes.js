const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const LoginController = require("../controllers/LoginController");
const MaterialController = require("../controllers/MaterialController");
const OrderController = require("../controllers/OrderController");
const ValueController = require("../controllers/ValueController");
const PaymentController = require("../controllers/PaymentController");
const CourseController = require("../controllers/CourseController");
const CheckoutController = require("../controllers/CheckoutController");
const {handleWebhookNotification, handleFailureRedirect, handleSuccessRedirect} = require("../controllers/WebHookController");
const isAuthenticated = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const upload = require("../middlewares/upload");

// WITHOUT AUTH
router.post("/auth/register", UserController.createUser);
router.post("/auth/login", LoginController.login);
// WITH AUTH
router.get("/users/me", isAuthenticated, UserController.getUser);
router.put("/users/me", isAuthenticated, UserController.updateUser);
router.get("/orders/me", isAuthenticated, OrderController.getOrdersByUser);
router.get("/materials/:id", isAuthenticated, MaterialController.getMaterial);
router.get("/materials", isAuthenticated, MaterialController.getAllMaterials);
router.get(
  "/materials/:id/metadata",
  isAuthenticated,
  MaterialController.getMaterialDetails
);
router.get("/values", isAuthenticated, ValueController.getValue);
router.get("/orders/:id", isAuthenticated, OrderController.getOrderById);
router.get(
  "/payments/:id",
  isAuthenticated,
  PaymentController.getPaymentDetails
);
router.get("/courses", CourseController.getAllCourses);
router.post("/orders", isAuthenticated, OrderController.createOrder);
router.post(
  "/materials",
  isAuthenticated,
  upload.single("file"),
  MaterialController.createMaterial
);
router.post(
  "/orders/calculate",
  isAuthenticated,
  OrderController.calculateOrderPrice
);
router.post("/checkout", isAuthenticated, CheckoutController.createPreference);
router.post("/webhooks/mercadopago", handleWebhookNotification)
router.get('/success', handleSuccessRedirect); 
router.get('/pending', handleSuccessRedirect);
router.get('/failure', handleFailureRedirect)



//WITH ADMIN
router.post("/values", isAuthenticated, isAdmin, ValueController.createValue);
router.put(
  "/orders/:id/status",
  isAuthenticated,
  isAdmin,
  OrderController.updateOrderStatus
);
router.get("/orders", isAuthenticated, isAdmin, OrderController.getAllOrders);
router.get(
  "/payments",
  isAuthenticated,
  isAdmin,
  PaymentController.getAllPayments
);
router.post(
  "/courses",
  isAuthenticated,
  isAdmin,
  CourseController.createCourse
);
router.get(
  "/courses/admin",
  isAuthenticated,
  isAdmin,
  CourseController.courseFilter
);
router.delete(
  "/courses/:id",
  isAuthenticated,isAdmin, CourseController.deleteCourse
);
router.get("/payments/admin/report", isAuthenticated, isAdmin, PaymentController.getAdminPaymentReport);
router.get("/users", isAuthenticated, isAdmin, UserController.getAllUsers);
router.put("/users/:id", isAuthenticated, isAdmin, UserController.updateUserRole);
router.get("/", (req, res) => {
  res.send("COPYFAN!");
});

module.exports = router;
