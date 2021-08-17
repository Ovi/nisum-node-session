const mongoose = require('mongoose');

const { Schema } = mongoose;

const SubscriptionSchema = new Schema(
  {
    name: {
      required: true,
      trim: true,
      type: String,
    },

    pricePerMonth: {
      required: true,
      type: Number,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model('Subscription', SubscriptionSchema);

module.exports = Subscription;
