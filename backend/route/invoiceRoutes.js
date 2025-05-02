const { authJwt } = require("../middlewares");
const invoiceController = require("../controllers/invoiceController");

module.exports = function (app) {
  /**
   * @swagger
   * /api/invoices/:
   *   get:
   *     summary: Récupérer toutes les factures
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Liste des factures
   *       500:
   *         description: Erreur serveur
   */
  app.get(
    "/api/invoices/",
    [authJwt.verifyToken],
    invoiceController.getAllInvoices
  );

  /**
   * @swagger
   * /api/invoices/:
   *   post:
   *     summary: Créer une nouvelle facture
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - userId
   *               - orderID
   *               - products
   *               - total
   *               - paymentStatus
   *             properties:
   *               userId:
   *                 type: string
   *                 description: ID de l'utilisateur
   *               orderID:
   *                 type: string
   *                 description: ID de la commande
   *               products:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Product'
   *               total:
   *                 type: number
   *                 description: Montant total
   *               paymentStatus:
   *                 type: string
   *                 description: Statut de paiement
   *     responses:
   *       201:
   *         description: Facture créée avec succès
   *       500:
   *         description: Erreur serveur
   */
  app.post(
    "/api/invoices/",
    [authJwt.verifyToken],
    invoiceController.createInvoice
  );

  /**
   * @swagger
   * /api/invoices/{id}:
   *   put:
   *     summary: Mettre à jour une facture
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de la facture
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Invoice'
   *     responses:
   *       200:
   *         description: Facture mise à jour avec succès
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Invoice'
   *       500:
   *         description: Erreur lors de la mise à jour de la facture
   */
  app.put(
    "/api/invoices/:id",
    [authJwt.verifyToken],
    invoiceController.updateInvoice
  );

  /**
   * @swagger
   * /api/invoices/{id}:
   *   delete:
   *     summary: Supprimer une facture
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID de la facture
   *     responses:
   *       200:
   *         description: Facture supprimée avec succès
   *       500:
   *         description: Erreur lors de la suppression de la facture
   */
  app.delete(
    "/api/invoices/:id",
    [authJwt.verifyToken],
    invoiceController.deleteInvoice
  );

  /**
   * @swagger
   * /api/paypal/create-order:
   *   post:
   *     summary: Créer une commande PayPal
   *     tags: [PayPal]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - total
   *               - cartItems
   *               - id
   *             properties:
   *               total:
   *                 type: number
   *               cartItems:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     price:
   *                       type: number
   *                     quantity:
   *                       type: integer
   *               id:
   *                 type: string
   *     responses:
   *       200:
   *         description: Commande PayPal créée avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 orderID:
   *                   type: string
   *       500:
   *         description: Erreur lors de la création de la commande PayPal
   */
  app.post(
    "/api/paypal/create-order",
    [authJwt.verifyToken],
    invoiceController.createPaypalInvoice
  );

  /**
   * @swagger
   * /api/paypal/capture-payment:
   *   post:
   *     summary: Capturer un paiement PayPal
   *     tags: [PayPal]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *             properties:
   *               orderId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Paiement capturé avec succès
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 invoice:
   *                   $ref: '#/components/schemas/Invoice'
   *       400:
   *         description: Paiement non complété
   *       500:
   *         description: Erreur lors de la capture du paiement PayPal
   */
  app.post(
    "/api/paypal/capture-payment",
    [authJwt.verifyToken],
    invoiceController.capturePaypalPayment
  );
};
