import express from "express";

const app = express();
const port = 3000; //add your port here
const PUBLISHABLE_KEY = "pk_test_51OToiZElZ1O2ZihGsTBUEvxU52lMPX4KY0nmxueq4x6Zk93a23hJGvTv7OoMl5QxSn4baSJOvkCexrNHzgqVDr1500MOmUOUuo";
const SECRET_KEY = "sk_test_51OToiZElZ1O2ZihGoeh2GvfKAfX87lyLS4J3lNaAsdSJRpOYJF0lsAb9a93nGtqqhJHbjEWtPsrPDiLdLmmLh8bP004jfeM2b9";
 
import Stripe from "stripe";

//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //lowest denomination of particular currency
      currency: "usd",
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});