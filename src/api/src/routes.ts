import { Router } from "express";
import { WelcomeController } from "./controllers/WelcomeController";
import { requireValidSessionMiddleware, sessionMiddleware } from "./middleware/sessionMiddleware";
import { AuthController } from "./controllers/AuthController";

// Create a router
export const router: Router = Router();

// Setup endpoints
router.get("/", (_, res) => {
    res.send("Welcome to the API!");
});

router.get("/test", (_, res) => {
    res.json({ message: "API is working!" });
});

// Initialize controllers
const welcomeController: WelcomeController = new WelcomeController();
const authController: AuthController = new AuthController();

// Auth endpoints (before session middleware - registration doesn't need a session)
router.post("/auth/register", authController.register);

// NOTE: After this line, all endpoints will check for a session.
router.use(sessionMiddleware);

router.get("/session", (req, res) => welcomeController.getSession(req, res));
router.delete("/session", (req, res) => welcomeController.deleteSession(req, res));
router.delete("/session/expired", (req, res) => welcomeController.deleteExpiredSessions(req, res));
router.get("/welcome", (req, res) => welcomeController.getWelcome(req, res));

// NOTE: After this line, all endpoints will require a valid session.
router.use(requireValidSessionMiddleware);

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

router.get("/cart", (_req, _res) => {
    throw new Error("Return a list of products in the cart and the total price");
});

router.use("*", (req, res) => {
    console.log(`Received request to: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        success: false,
        message: `Path not found: ${req.method} ${req.originalUrl}`
    });
});
