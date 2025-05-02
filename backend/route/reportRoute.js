const { authJwt } = require("../middlewares");
const reportController = require("../controllers/reportController");

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
   * /api/reports/{types}/{userId}:
   *   get:
   *     summary: Générer un rapport
   *     tags: [Reports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: types
   *         schema:
   *           type: string
   *         required: true
   *         description: Type de rapport (sales ou performance)
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de l'utilisateur
   *     responses:
   *       200:
   *         description: Rapport généré avec succès
   *       500:
   *         description: Erreur serveur
   */
  app.get(
    "/api/reports/:types/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    reportController.generateReport
  );

  /**
   * @swagger
   * /api/reports/{types}/{userId}:
   *   get:
   *     summary: Générer un rapport
   *     tags: [Reports]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: types
   *         schema:
   *           type: string
   *         required: true
   *         description: Type de rapport (sales ou performance)
   *       - in: path
   *         name: userId
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de l'utilisateur
   *     responses:
   *       200:
   *         description: Rapport généré avec succès
   *       500:
   *         description: Erreur serveur
   */
  app.get(
    "/api/reports",
    [authJwt.verifyToken, authJwt.isAdmin],
    reportController.generateReport
  );
};
