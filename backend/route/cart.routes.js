const { authJwt } = require("../middlewares");
const CartController = require("../controllers/cart.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  /**
   * @swagger
   * /api/cart:
   *   post:
   *     summary: Créer un nouveau panier
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Panier créé avec succès
   *       400:
   *         description: Erreur de validation
   */
  app.post("/api/cart", [authJwt.verifyToken], CartController.createCart);

  /**
   * @swagger
   * /api/cart:
   *   get:
   *     summary: Récupérer tous les paniers d'un utilisateur
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de l'utilisateur
   *     responses:
   *       200:
   *         description: Liste des paniers
   *       404:
   *         description: Aucun panier trouvé
   */
  app.get(
    "/api/cart",
    [authJwt.verifyToken],
    CartController.getAllCarts
  );

  /**
   * @swagger
   * /api/cart/{id}:
   *   get:
   *     summary: Obtenir un panier spécifique
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du panier
   *     responses:
   *       200:
   *         description: Panier trouvé
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       500:
   *         description: Erreur serveur
   */
  app.get("/api/cart/:id", [authJwt.verifyToken], CartController.getCart);

  /**
   * @swagger
   * /api/cart/add/{id}:
   *   put:
   *     summary: Ajouter un produit au panier
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du panier
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Produit ajouté au panier
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       404:
   *         description: Panier non trouvé
   *       400:
   *         description: Erreur de requête
   */

  app.put("/api/cart/add/:id", [authJwt.verifyToken], CartController.addToCart);

  /**
   * @swagger
   * /api/cart/remove/{id}:
   *   put:
   *     summary: Retirer un produit du panier
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du panier
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - product_id
   *             properties:
   *               product_id:
   *                 type: string
   *     responses:
   *       200:
   *         description: Produit retiré du panier
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Cart'
   *       404:
   *         description: Panier non trouvé
   *       400:
   *         description: Erreur de requête
   */
  app.put(
    "/api/cart/remove/:id",
    [authJwt.verifyToken],
    CartController.removeToCart
  );

  /**
   * @swagger
   * /api/cart/{id}:
   *   delete:
   *     summary: Supprimer un panier
   *     tags: [Cart]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID du panier
   *     responses:
   *       200:
   *         description: Panier supprimé avec succès
   *       404:
   *         description: Panier non trouvé
   *       500:
   *         description: Erreur serveur
   */
  app.delete("/api/cart/:id", [authJwt.verifyToken], CartController.deleteCart);
};
