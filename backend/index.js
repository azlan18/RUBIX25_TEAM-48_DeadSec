// backend/index.js
const express = require('express');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const zod = require("zod");
require('dotenv').config();

// Import db connection
require('./db');

const { User } = require("./db");
const postRoutes = require('./routes/post');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// SIGNUP ROUTE //

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})
app.post("/signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;



    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
})

// SIGNIN ROUTE //

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})
app.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.username
        }, process.env.JWT_SECRET);
  
        res.json({
            token: token,
            user: {
                username: user.username,
                email: user.username
            }
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

// Routes
app.use('/api/posts', postRoutes);



const multer = require("multer");
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB file size limit
  }
});

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Route to handle product image upload and get structured JSON response
app.post("/upload-product", upload.single("productImage"), async (req, res) => {
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Read the uploaded file
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString('base64');

    // Initialize the model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          description: "Product comparison and sustainability metrics",
          type: "object",
          properties: {
            product_searched: {
              type: "object",
              properties: {
                product: { type: "string", description: "Name of the product" },
                eco_score: { type: "string", description: "Eco-score from 1 to 10" },
                carbon_footprint: { type: "string", description: "Carbon footprint in kg CO2" },
                water_usage: { type: "string", description: "Water usage in liters" },
                waste_generated: { type: "string", description: "Waste generated in kg" },
              },
              required: ["product", "eco_score"],
            },
            better_alternative_product: {
              type: "object",
              properties: {
                product: { type: "string", description: "Name of the alternative product" },
                eco_score: { type: "string", description: "Eco-score from 1 to 10" },
                carbon_footprint: { type: "string", description: "Carbon footprint in kg CO2" },
                water_usage: { type: "string", description: "Water usage in liters" },
                waste_generated: { type: "string", description: "Waste generated in kg" },
              },
              required: ["product", "eco_score"],
            },
          },
          required: ["product_searched", "better_alternative_product"],
        },
      },
    });

    // Detailed prompt with image analysis
    const prompt = `
    Perform a comprehensive sustainability analysis of the uploaded product image.

    Detailed Analysis Requirements:
    1. Precisely identify the exact product type and brand from the image
    2. Conduct an in-depth assessment of its current environmental impact
    3. Research and propose a genuine, more sustainable alternative specific to this product

    Sustainability Metrics Guidelines:
    - Provide accurate, data-driven eco-scores from 1-10
    - Include precise carbon footprint calculations
    - Estimate water usage and waste generation
    - Base calculations on verifiable industry and manufacturer data
    - Compare the original product with a superior eco-friendly alternative

    Response Format:
    - Use scientifically grounded, specific metrics
    - Avoid generic or placeholder data
    - Ensure each metric is backed by research
    `;

    // Prepare the request with the image
    const result = await model.generateContent([
      { text: prompt },
      { 
        inlineData: { 
          mimeType: "image/jpeg", 
          data: base64Image 
        } 
      }
    ]);

    // Log raw result for debugging
    console.log("Raw AI Response:", result.response.text());

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(result.response.text());
    } catch (parseError) {
      console.error("JSON Parsing Error:", parseError);
      return res.status(500).json({ 
        error: "Failed to parse AI response", 
        rawResponse: result.response.text() 
      });
    }

    // Delete the temporary uploaded file
    fs.unlinkSync(req.file.path);

    // Send the parsed response
    res.json(parsedResponse);

  } catch (error) {
    console.error("Detailed Error:", error);
    res.status(500).json({ 
      error: "Something went wrong during product analysis", 
      details: error.message 
    });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});