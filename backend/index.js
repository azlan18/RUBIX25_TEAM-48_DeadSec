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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});