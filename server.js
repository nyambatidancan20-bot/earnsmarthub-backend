const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// USER SCHEMA
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);
const app = express();
app.use(cors());
app.use(express.json());

// 🔗 CONNECT TO MONGODB
mongoose.connect("mongodb://dellion:04BzYw6ioIpOuVwj@ac-k2ii7wk-shard-00-00.kvirdua.mongodb.net:27017,ac-k2ii7wk-shard-00-01.kvirdua.mongodb.net:27017,ac-k2ii7wk-shard-00-02.kvirdua.mongodb.net:27017/earnsmarthub?ssl=true&replicaSet=atlas-h4dhuk-shard-0&authSource=admin&retryWrites=true&w=majority")
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log("MongoDB error ❌:", err));

// 📧 SCHEMA
const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
});

// 📦 MODEL
const Subscriber = mongoose.model("Subscriber", subscriberSchema);

// 📥 ROUTE: SAVE EMAIL
app.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const newSub = new Subscriber({ email });
        await newSub.save();

        res.json({ message: "Subscribed successfully 🚀" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error ❌" });
    }
});

// 🧪 TEST ROUTE
app.get("/", (req, res) => {
    res.send("EarnSmartHub backend running 🚀");
});

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.json({ message: "User created ✅" });

    } catch (err) {
        res.status(500).json({ message: "Error creating user ❌" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found ❌" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password ❌" });
        }

        const token = jwt.sign({ id: user._id }, "secretkey");

        res.json({ message: "Login successful ✅", token });

    } catch (err) {
        res.status(500).json({ message: "Login error ❌" });
    }
});

// ▶️ START SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});