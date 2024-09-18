import express from "express";
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';

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
      amount: 10000,
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



const prisma = new PrismaClient();

app.use(bodyParser.json());


app.post('/saveMarriage', async (req, res) => {
  const { girlName, girlDob, manName, manDob, firstDowry, lastDowry, notes, firstWitness, secondWitness, userId } = req.body;
   
  const currentDate = new Date();
const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;


  try {
    const marriage = await prisma.marriage.create({
      data: {
        girlName,
        girlDob,
        manName,
        manDob,
        firstDowry,
        lastDowry,
        notes,
        firstWitness,
        secondWitness,
        date: formattedDate,  
        userId,
      },
    });
    res.status(200).json({ success: true, marriage });
  } catch (error) {
    console.error("Error saving marriage:", error);
    res.status(500).json({ success: false, error: "Failed to save marriage" });
  }
});




app.get('/getMarriages', async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    // Retrieve all marriages associated with the given userId
    const marriages = await prisma.marriage.findMany({
      where: {
        userId: userId, // Filter by userId
      },
    });

    if (marriages.length === 0) {
      return res.status(404).json({ success: false, message: "No marriages found for this user" });
    }

    res.status(200).json({ success: true, marriages });
  } catch (error) {
    console.error("Error fetching marriages:", error);
    res.status(500).json({ success: false, error: "Failed to fetch marriages" });
  }
});




app.post('/saveDivorce', async (req, res) => {
  const { girlName, girlDob, girlRN, manName, manDob, manRN, notes, firstWitness, firstWitnessRN, secondWitness, secondWitnessRN, date, userId } = req.body;
  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
  
  try {
    const divorce = await prisma.divorce.create({
      data: {
        girlName, girlDob, girlRN, manName, manDob, manRN, notes, firstWitness, firstWitnessRN, secondWitness, secondWitnessRN, date: formattedDate, userId
      },
    });
    res.status(200).json({ success: true, divorce });
  } catch (error) {
    console.error("Error saving divorce:", error);
    res.status(500).json({ success: false, error: "Failed to save divorce" });
  }
});



app.get('/getDivorces', async (req, res) => {
  const { userId } = req.query; // Get userId from query parameters

  try {
    // Retrieve all marriages associated with the given userId
    const divorce = await prisma.divorce.findMany({
      where: {
        userId: userId, // Filter by userId
      },
    });

    if (divorce.length === 0) {
      return res.status(404).json({ success: false, message: "No divorce found for this user" });
    }

    res.status(200).json({ success: true, divorce });
  } catch (error) {
    console.error("Error fetching divorce:", error);
    res.status(500).json({ success: false, error: "Failed to fetch divorce" });
  }
});



app.post('/saveConsult', async (req, res) => {
  const { consultData, consultResult, userId } = req.body; 
  try {
    const consult = await prisma.consult.create({
      data: {
        consultData, consultResult, userId
      },
    });
    res.status(200).json({ success: true, consult });
  } catch (error) {
    console.error("Error saving consult:", error);
    res.status(500).json({ success: false, error: "Failed to save consult" });
  }
});



app.get('/getConsults', async (req, res) => {
  const { userId } = req.query;  

  try { 
    const consult = await prisma.consult.findMany({
      where: {
        userId: userId,  
      },
    });

    if (consult.length === 0) {
      return res.status(404).json({ success: false, message: "No consult found for this user" });
    }

    res.status(200).json({ success: true, consult });
  } catch (error) {
    console.error("Error fetching consult:", error);
    res.status(500).json({ success: false, error: "Failed to fetch consult" });
  }
});
