const controller = require("../controllers/user.controller");
const { authJwt } = require("../middlewares");

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
   * /api/user/{id}:
   *   get:
   *     summary: Récupérer un utilisateur par ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de l'utilisateur
   *     responses:
   *       200:
   *         description: Utilisateur trouvé
   *       404:
   *         description: Utilisateur non trouvé
   */
  app.get("/api/user/:id", [authJwt.verifyToken], controller.getUser);

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Récupérer tous les utilisateurs
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Liste des utilisateurs
   *       404:
   *         description: Aucun utilisateur trouvé
   */
  app.get("/api/users", [authJwt.verifyToken], controller.getAllUsers);

  /**
   * @swagger
   * /api/users:
   *   put:
   *     summary: Mettre à jour l'utilisateur
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
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
   *       200:
   *         description: Utilisateur mis à jour avec succès
   *       404:
   *         description: Utilisateur non trouvé
   */
  app.put("/api/users", [authJwt.verifyToken], controller.updateUser);

  /**
   * @swagger
   * /api/users/role/{id}:
   *   put:
   *     summary: Définir le rôle d'un utilisateur
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de l'utilisateur
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - roles
   *             properties:
   *               roles:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Liste des rôles
   *     responses:
   *       200:
   *         description: Rôles mis à jour avec succès
   *       404:
   *         description: Utilisateur non trouvé
   */
  app.put("/api/users/role/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.setRole);

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Supprimer un utilisateur
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID de l'utilisateur
   *     responses:
   *       200:
   *         description: Utilisateur supprimé avec succès
   *       404:
   *         description: Utilisateur non trouvé
   */
  app.delete("/api/users/", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);

  /**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Récupérer les infos de l'utilisateur connecté
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Utilisateur connecté
 *       401:
 *         description: Non autorisé
 */
  app.get("/api/users/me", [authJwt.verifyToken], controller.getMe);

};

