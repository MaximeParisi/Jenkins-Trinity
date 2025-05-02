const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *       properties:
 *         firstName:
 *           type: string
 *           description: Prénom
 *         lastName:
 *           type: string
 *           description: Nom
 *         phoneNumber:
 *           type: string
 *           description: Numéro de téléphone
 *
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           description: Nom du produit
 *         quantity:
 *           type: integer
 *           description: Quantité
 *         price:
 *           type: number
 *           description: Prix
 *
 *     Invoice:
 *       type: object
 *       required:
 *         - orderID
 *         - customer
 *         - products
 *         - totalAmount
 *         - paymentStatus
 *       properties:
 *         orderID:
 *           type: string
 *           description: ID de la commande
 *         customer:
 *           type: object
 *           description: Informations du client
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         totalAmount:
 *           type: number
 *           description: Montant total
 *         paymentStatus:
 *           type: string
 *           description: Statut de paiement
 */

db.user = require("./user.model");
db.role = require("./role.model");
db.product = require("./Product");
db.report = require("./Report");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
