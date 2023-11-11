const User = require("../models/user.model");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const createCustomer = async (req, res) => {
  const user = await User.findById(req.params.userId);
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.name} ${user.lastName}`,
  });
  res.send({ customerId: customer.id });
};

const createSubscription = async (req, res) => {
  const { customerId, paymentMethodId } = req.body;

  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ plan: "price_1OAyNGLxWE0zVARfRMTOiG3l" }],
    expand: ["latest_invoice.payment_intent"],
  });
  res.send(subscription);
};

module.exports = { createCustomer, createSubscription };
