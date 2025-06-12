import { Router } from "express";
import { WelcomeController } from "./controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./middleware/sessionMiddleware";
import { CartController } from "./controllers/CartController";
import { CheckoutController } from "@api/controllers/CheckoutController";
import { GamesController } from "./controllers/GamesController";
import { OrdersGamesController } from "@api/controllers/OrdersGamesController";
import { AuthController } from "./controllers/AuthController";
import { TagController } from "./controllers/TagController";
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
const addressLookupController: AddressLookupController = new AddressLookupController();

router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.get("/games/search", (req, res) => gamesController.searchGames(req, res));
router.get("/game-info", (req, res) => gamesController.getGameById(req, res));
router.get("/games", (req, res) => gamesController.getGames(req, res));
router.get("/orders-games", (req, res) => ordersGamesController.getOrdersGames(req, res));
router.get("/tags", (req, res) => tagController.getTags(req, res));

// NOTE: After this line, all endpoints will check for a session.
router.use(sessionMiddleware);

router.get("/auth/verify", (req, res) => authController.verify(req, res));
router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));
router.get("/game-info", (req, res) => gamesController.getGameById(req, res));
router.get("/games", (req, res) => gamesController.getGames(req, res));
router.get("/orders-games", (req, res) => ordersGamesController.getOrdersGames(req, res));

// NOTE: After this line, all endpoints will require a valid session.
router.use(requireValidSessionMiddleware);
router.post("/create-cart", (req, res) => cartController.createCart(req, res));
router.get("/cart", (req, res) => cartController.getCart(req, res));
router.delete("/cart/:gameId", (req, res) => cartController.deleteCartItem(req, res));
router.get("/checkout", (req, res) => checkoutController.getCheckout(req, res));
router.post("/checkout", (req, res) => checkoutController.postCheckout(req, res));
router.get("/address-lookup", (req, res) => addressLookupController.getAddressLookup(req, res));
router.get("/owned-games", (req, res) => gamesController.getOwnedGames(req, res));
router.get("/secret", (req, res) => welcomeController.getSecret(req, res));

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
