const mongoose = require("mongoose");
const User = require("../models/user.model");
const Subscription = require("../models/subscription.model");
const UserConfig = require("../models/userConfig.model");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const getSubscriptionDetails = async (req, res) => {
  const userId = req.params.userId;
  const userSubscription = await Subscription.findOne({ userId });

  if (!userSubscription) {
    res.status(404).send({ error: "Subscription not found" });
    return;
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(
      userSubscription.subscriptionId
    );

    res.status(200).send({
      subscription,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

const getCustomer = async (req, res) => {
  const user = await User.findById(req.params.userId);

  const existingCustomers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0)
    return res.send({
      customerId: existingCustomers.data[0].id,
    });

  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.name} ${user.lastName}`,
  });
  res.send({ customerId: customer.id });
};

const createSubscription = async (req, res) => {
  const { customerId, paymentMethodId } = req.body;
  const userId = req.params.userId;

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

  const subscriptionId = subscription.id;
  await Subscription.create({
    _id: new mongoose.Types.ObjectId(),
    subscriptionId,
    userId,
    customerId,
    paymentMethodId,
    date: new Date(),
  });
  await UserConfig.findOneAndUpdate(
    { userId: userId },
    { $set: { isPremium: true } }
  );

  res.send(subscription);
};

const cancelSubscription = async (req, res) => {
  const userId = req.params.userId;

  const userSubscription = await Subscription.findOne({ userId });

  if (!userSubscription) {
    res.status(404).send({ error: "Subscription not found" });
    return;
  }

  try {
    await stripe.subscriptions.cancel(userSubscription.subscriptionId);
    await Subscription.findByIdAndDelete(userSubscription._id);
    await UserConfig.findOneAndUpdate(
      { userId: userId },
      { $set: { isPremium: false } }
    );

    res.status(200).send({
      message: "Subscription cancelled.",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

module.exports = {
  getCustomer,
  createSubscription,
  cancelSubscription,
  getSubscriptionDetails,
};
