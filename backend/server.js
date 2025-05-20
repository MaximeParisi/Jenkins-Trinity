const express = require("express");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swagger");
const cors = require("cors");
require("dotenv").config();
const app = express();
const db = require("./models");
const Role = db.role;
const URL = process.env.CLIENT_URL;
const Product = require("./models/Product");


// Import the logger middleware
const {
  morganLogger,
  requestLogger,
  errorLogger,
} = require("./middlewares/logger");

// Apply logger middleware BEFORE any route handlers
app.use(morganLogger);
app.use(requestLogger);

// Database connection
db.mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
    initProducts();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  origin: [`${URL}`, "https://app.gotham.titlepack.io", "http://localhost:4000", "http://217.182.61.107:4000", "http://217.182.61.107:3000" , "http://localhost:3000"],
  credentials: true,
};

async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();
    if (count === 0) {
      await Promise.all([
        new Role({ name: "user" })
          .save()
          .then(() => console.log("added 'user' to roles collection")),
        new Role({ name: "moderator" })
          .save()
          .then(() => console.log("added 'moderator' to roles collection")),
        new Role({ name: "admin" })
          .save()
          .then(() => console.log("added 'admin' to roles collection")),
      ]);
    }
  } catch (err) {
    console.error("Error during role initialization:", err);
  }
}

async function initProducts() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        {
          name: "Pâtes complètes",
          price: 2.49,
          brand: "Barilla",
          picture: "https://example.com/images/pates.jpg",
          category: "Alimentation",
          nutritionalInformation: {
            calories: 350,
            proteins: "12g",
            carbs: "70g",
            fats: "2g"
          },
          availableQuantity: 150
        },
        {
          name: "Lait demi-écrémé",
          price: 1.05,
          brand: "Lactel",
          picture: "https://example.com/images/lait.jpg",
          category: "Boissons",
          nutritionalInformation: {
            calories: 47,
            proteins: "3.4g",
            carbs: "4.8g",
            fats: "1.6g"
          },
          availableQuantity: 200
        },
        {
          name: "Chocolat noir 70%",
          price: 2.30,
          brand: "Lindt",
          picture: "https://example.com/images/chocolat.jpg",
          category: "Confiserie",
          nutritionalInformation: {
            calories: 520,
            sugar: "29g",
            fats: "40g"
          },
          availableQuantity: 80
        }
      ]);
      console.log("Produits initiaux ajoutés à la collection.");
    }
  } catch (err) {
    console.error("Erreur lors de l'initialisation des produits :", err);
  }
}


app.use(cors(corsOptions));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to trinity application." });
});

// Routes
require("./route/auth.routes")(app);
require("./route/user.routes")(app);
require("./route/cart.routes")(app);
require("./route/invoiceRoutes")(app);
require("./route/productRoutes")(app);
require("./route/reportRoute")(app);

// Error logger middleware - must be AFTER routes
app.use(errorLogger);

// 404 handler - catches all unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
