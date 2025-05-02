const { authJwt } = require("../middlewares");
const productController = require("../controllers/productController");

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
   * /api/products:
   *   get:
   *     summary: Récupérer tous les produits
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des produits
   *       500:
   *         description: Erreur serveur
   */
  app.get(
    "/api/products",
    [authJwt.verifyToken],
    productController.getProducts
  );

  /**
   * @swagger
   * /api/products/{barcode}:
   *   post:
   *     summary: Ajouter un nouveau produit
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: barcode
   *         schema:
   *           type: string
   *         required: true
   *         description: Code-barres du produit
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - quantity
   *               - price
   *             properties:
   *               quantity:
   *                 type: integer
   *                 description: Quantité
   *               price:
   *                 type: number
   *                 description: Prix
   *     responses:
   *       201:
   *         description: Produit ajouté avec succès
   *       400:
   *         description: Erreur de validation
   */
  app.post(
    "/api/products/:barcode",
    [authJwt.verifyToken],
    productController.addProduct
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     summary: Mettre à jour un produit
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID du produit
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Product'
   *     responses:
   *       200:
   *         description: Produit mis à jour
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Product'
   *       404:
   *         description: Produit non trouvé
   *       500:
   *         description: Erreur serveur
   */
  app.put(
    "/api/products/:id",
    [authJwt.verifyToken],
    productController.updateProduct
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     summary: Supprimer un produit
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID du produit
   *     responses:
   *       200:
   *         description: Produit supprimé avec succès
   *       404:
   *         description: Produit non trouvé
   *       500:
   *         description: Erreur serveur
   */
  app.delete(
    "/api/products/:id",
    [authJwt.verifyToken],
    productController.deleteProduct
  );

  /**
   * @swagger
   * /api/off:
   *   use:
   *     summary: Récupérer tous les produits en promotion
   *     tags: [Products]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des produits en promotion
   *       500:
   *         description: Erreur serveur
   */
  app.use(
    "/api/off",
    [authJwt.verifyToken],
    productController.getAllProductsOFF
  );
};
