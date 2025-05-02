const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

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
   * /api/users:
   *   post:
   *     summary: Inscription d'un nouvel utilisateur
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - phoneNumber
   *               - password
   *             properties:
   *               firstName:
   *                 type: string
   *                 description: Prénom
   *               lastName:
   *                 type: string
   *                 description: Nom
   *               phoneNumber:
   *                 type: string
   *                 description: Numéro de téléphone
   *               password:
   *                 type: string
   *                 description: Mot de passe
   *     responses:
   *       201:
   *         description: Utilisateur créé avec succès
   *       500:
   *         description: Erreur serveur
   */
  app.post(
    "/api/users",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *     summary: Connexion d'un utilisateur
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phoneNumber
   *               - password
   *             properties:
   *               phoneNumber:
   *                 type: string
   *                 description: Numéro de téléphone
   *               password:
   *                 type: string
   *                 description: Mot de passe
   *     responses:
   *       200:
   *         description: Connexion réussie
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 firstName:
   *                   type: string
   *                 lastName:
   *                   type: string
   *                 phoneNumber:
   *                   type: string
   *                 roles:
   *                   type: array
   *                   items:
   *                     type: string
   *       401:
   *         description: Mot de passe incorrect
   *       404:
   *         description: Utilisateur non trouvé
   */
  app.post("/api/auth/signin", controller.signin);
};
