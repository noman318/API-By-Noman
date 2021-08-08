require("dotenv").config();

const express = require("express");

const connectDB = require("./connection");

const userModel = require("./user");

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const user = await userModel.find();
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.get("/user/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const user = await userModel.find({ userType: type });
    if (!user) {
      return res.json({ MessageChannel: "No user found" });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.get("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await userModel.findById({ _id });
    if (!user) {
      return res.json({ MessageChannel: "No user found" });
    }
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.post("/user/new", async (req, res) => {
  try {
    const { newUser } = req.body;
    await userModel.create(newUser);
    return res.json({ message: "User Created" });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.put("/user/update/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { userData } = req.body;
    const updateUser = await userModel.findByIdAndUpdate(
      _id,
      { $set: userData },
      { new: true }
    );
    return res.json({ user: updateUser });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.delete("/user/delete/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await userModel.findByIdAndDelete(_id);

    return res.json({ MessageChannel: "User Deleted 🗡️" });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.delete("/user/delete/type/:userType", async (req, res) => {
  try {
    const { userType } = req.params;
    const alluser = await userModel.findOneAndDelete({ userType });

    return res.json({ MessageChannel: "User Deleted 🗡️" });
  } catch (error) {
    return res.status(500).json({ error: error.MessageChannel });
  }
});

app.listen(process.env.PORT, () =>
  connectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch((error) => console.log(error))
);
