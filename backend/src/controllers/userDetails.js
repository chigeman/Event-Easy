const express = require('express');
const userModel = require('../models/userModel'); // Assuming you have a User model

// Controller to get user details
const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User is not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to update user details
const updateUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getUserDetails,
    updateUserDetails,
};