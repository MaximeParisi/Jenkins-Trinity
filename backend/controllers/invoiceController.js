const Invoice = require("../models/Invoice");
const User = require("../models/user.model");

const paypal = require("@paypal/checkout-server-sdk");

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

const { v4: uuidv4 } = require("uuid");

exports.getAllInvoices = async (req, res) => {
  try {
    let query = {};

    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.minAmount && req.query.maxAmount) {
      query.totalAmount = {
        $gte: Number(req.query.minAmount),
        $lte: Number(req.query.maxAmount),
      };
    }

    if (!req.user.roles.includes("admin")) {
      query.userId = req.user.id;
    }

    const invoices = await Invoice.find(query);
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      error: "Erreur lors de la récupération des factures.",
      details: error.message,
    });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const { userId, orderID, products, total, paymentStatus } = req.body;
    const user = await User.findById(userId);

    let newInvoice = new Invoice();
    newInvoice.orderID = orderID;
    newInvoice.customer = user;
    newInvoice.products = products;
    newInvoice.totalAmount = total;
    newInvoice.paymentStatus = paymentStatus;

    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la facture." });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedInvoice);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la facture." });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Facture supprimée avec succès." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la facture." });
  }
};

exports.createPaypalInvoice = async (req, res) => {
  try {
    const { total, cartItems, id } = req.body;
    const orderRequest = new paypal.orders.OrdersCreateRequest();
    orderRequest.prefer("return=representation");
    orderRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: uuidv4().replace(/-/g, ""),
          amount: {
            currency_code: "USD",
            value: total,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total,
              },
            },
          },
          description: "My purchase",
          items: cartItems.map((item) => ({
            name: item.name,
            unit_amount: {
              currency_code: "USD",
              value: item.price,
            },
            quantity: item.quantity,
          })),
        },
      ],
      application_context: {
        brand_name: "Trinity",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.PAYPAL_RETURN_URL}`,
        cancel_url: `${process.env.PAYPAL_CANCEL_URL}`,
      },
    });

    const order = await client.execute(orderRequest);

    res.status(200).json({ orderID: order.result.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    res.status(500).json({ error: "Error creating PayPal order" });
  }
};

exports.capturePaypalPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.requestBody({});

    const capture = await client.execute(captureRequest);

    if (capture.result.status === "COMPLETED") {
      const invoice = await Invoice.findOneAndUpdate(
        { orderId },
        { paymentStatus: "completed" },
        { new: true }
      );

      res.status(200).json({ message: "Payment successful", invoice });
    } else {
      res.status(400).json({ error: "Payment not completed" });
    }
  } catch (error) {
    console.error("Error capturing PayPal payment:", error);
    res.status(500).json({ error: "Error capturing PayPal payment" });
  }
};
