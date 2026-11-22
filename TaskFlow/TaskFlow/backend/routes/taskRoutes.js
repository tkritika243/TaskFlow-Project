const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ADD TASK
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            user: req.user
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET ALL TASKS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user
        }).sort({ createdAt: -1 });

        res.json({ tasks });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description, completed } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user },
            { title, description, completed },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;