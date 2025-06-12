import { Router } from "express";
import { WelcomeController } from "./controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./middleware/sessionMiddleware";
import { CartController } from "./controllers/CartController";
import { CheckoutController } from "@api/controllers/CheckoutController";
import { GamesController } from "./controllers/GamesController";
import { OrdersGamesController } from "@api/controllers/OrdersGamesController";
import { AuthController } from "./controllers/AuthController";
import { TagController } from "./controllers/TagController";
import { UserController } from "./controllers/UserController";
import { requireRole } from "./middleware/rolesMiddleWare";
import { ImageProxyController } from "./controllers/ImageProxyController";
import { formidableMiddleware } from "./middleware/formidableMiddleWare";
import { ChartController } from "./controllers/ChartsController";
import { AddressLookupController } from "./controllers/AddressLookupController";

// Create a router
export const router: Router = Router();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

// Initialize controllers
const welcomeController: WelcomeController = new WelcomeController();
const checkoutController: CheckoutController = new CheckoutController();
const gamesController: GamesController = new GamesController();
const ordersGamesController: OrdersGamesController = new OrdersGamesController();
const authController: AuthController = new AuthController();
const cartController: CartController = new CartController();
const tagController: TagController = new TagController();
const userController: UserController = new UserController();
const imageProxyController: ImageProxyController = new ImageProxyController();
const chartController: ChartController = new ChartController();
const addressLookupController: AddressLookupController = new AddressLookupController();

// Public routes (no authentication required)
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/games/search", (req, res) => gamesController.searchGames(req, res));
router.get("/games", (req, res) => gamesController.getGames(req, res));
router.get("/orders-games", (req, res) => ordersGamesController.getOrdersGames(req, res));
router.get("/tags", (req, res) => tagController.getTags(req, res));
router.get("/five-random-games", (req, res) => gamesController.getFiveRandomGames(req, res));
router.get("/tags/:id", (req, res) => tagController.getTagById(req, res));

// NOTE: After this line, all endpoints will check for a session.
router.use(sessionMiddleware);

router.get("/game-info", (req, res) => gamesController.getGameById(req, res));
router.get("/auth/verify", (req, res) => authController.verify(req, res));
router.post("/auth/logout", (req, res) => authController.logout(req, res)); // NEW LOGOUT ROUTE
router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));
router.get("/game-info", (req, res) => gamesController.getGameById(req, res));
router.get("/orders-games", (req, res) => ordersGamesController.getOrdersGames(req, res));
router.get("/users/me", (req, res) => userController.getCurrentUser(req, res));
router.get("/payments/status", (req, res) => checkoutController.getPaymentStatus(req, res));

// NOTE: After this line, all endpoints will require a valid session.
router.use(requireValidSessionMiddleware);
router.post("/create-cart", (req, res) => cartController.createCart(req, res));
router.get("/cart", (req, res) => cartController.getCart(req, res));
router.delete("/cart/:gameId", (req, res) => cartController.deleteCartItem(req, res));
router.get("/checkout", (req, res) => checkoutController.getCheckout(req, res));
router.post("/checkout", (req, res) => checkoutController.postCheckout(req, res));
router.post("/payments/create", (req, res) => checkoutController.createPayment(req, res));
router.get("/address-lookup", (req, res) => addressLookupController.getAddressLookup(req, res));router.get("/invoice/:orderId", (req, res) => checkoutController.getInvoice(req, res));

router.get("/owned-games", (req, res) => gamesController.getOwnedGames(req, res));

// NOTE: After this line, all endpoints will require the user to have the "admin" role.
router.use(requireRole("admin"));
router.get("/secret", (req, res) => welcomeController.getSecret(req, res));
router.put("/users/:id", (req, res) => userController.updateUser(req, res));
router.put("/users/:id/address", (req, res) => userController.updateAddress(req, res));
router.get("/orders", (req, res) => ordersGamesController.getOrders(req, res));
router.get("/image-proxy", (req, res) => imageProxyController.getImage(req, res));
router.get("/users", (req, res) => userController.getUsers(req, res));
router.get("/users/:id/toggle-admin", (req, res) => userController.toggleAdminRole(req, res));

// Chart operations
router.get("/chart/turnover", (req, res) => chartController.getTurnoverByYear(req, res));
router.get("/chart/orders", (req, res) => chartController.getOrdersByMonth(req, res));
router.get("/chart/tags", (req, res) => chartController.getGamesTags(req, res));

// Game CRUD operations
router.post("/games", formidableMiddleware, (req, res) => gamesController.createGame(req, res));
router.put("/games/:id", formidableMiddleware, (req, res) => gamesController.updateGame(req, res));
router.delete("/games/:id", (req, res) => gamesController.deleteGame(req, res));

// Tag CRUD operations
router.post("/tags", (req, res) => tagController.createTag(req, res));
router.put("/tags/:id", (req, res) => tagController.updateTag(req, res));
router.delete("/tags/:id", (req, res) => tagController.deleteTag(req, res));

// TODO: The following endpoints have to be implemented in their own respective controller
router.get("/products", (_req, _res) => {
    throw new Error("Return a list of products");
});

router.get("/products/:id", (_req, _res) => {
    throw new Error("Return a specific product");
});

router.post("/cart/add", (_req, _res) => {
    throw new Error("Add a product to the cart");
});

router.post("/Checkout/add", (_req, _res) => {
    throw new Error("Add a product to the cart");
});

export default router;
