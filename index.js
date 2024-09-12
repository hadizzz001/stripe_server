import express from "express";
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import { Document, Packer, Paragraph, TextRun } from "docx"; // Updated import
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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



app.post("/saveMarriage", async (req, res) => {
  const {
    girlName,
    girlDob,
    manName,
    manDob,
    firstDowry,
    lastDowry,
    notes,
    firstWitness,
    secondWitness,
    userId,
  } = req.body;

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
        userId,
      },
    });

    // Generate Word document with the details
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `Marriage Details`, bold: true, size: 32 }),
                new TextRun("\n"),
                new TextRun(`Girl Name: ${girlName}`),
                new TextRun("\n"),
                new TextRun(`Girl Date of Birth: ${girlDob}`),
                new TextRun("\n"),
                new TextRun(`Man Name: ${manName}`),
                new TextRun("\n"),
                new TextRun(`Man Date of Birth: ${manDob}`),
                new TextRun("\n"),
                new TextRun(`First Dowry: ${firstDowry}`),
                new TextRun("\n"),
                new TextRun(`Last Dowry: ${lastDowry}`),
                new TextRun("\n"),
                new TextRun(`Notes: ${notes}`),
                new TextRun("\n"),
                new TextRun(`First Witness: ${firstWitness}`),
                new TextRun("\n"),
                new TextRun(`Second Witness: ${secondWitness}`),
              ],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(__dirname, "marriage-details.docx");
    fs.writeFileSync(filePath, buffer);

    res.status(200).json({ success: true, marriage, filePath });
  } catch (error) {
    console.error("Error saving marriage:", error);
    res.status(500).json({ success: false, error: "Failed to save marriage" });
  }
});
