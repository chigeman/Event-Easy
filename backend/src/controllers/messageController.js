const Message = require('../models/messageModel');
const cloudinary = require('../utils/cloudinary'); // Assuming you have a cloudinary utility for image uploads

// 📩 Get all messages for a specific room
const getMessages = async (req, res) => {
  try {
    const {id:userToChatId} = req.params;
    const SenderId = req.user._id;
    const messages = await Message.find({ 
        $or: [
            { sender: SenderId, receiver: userToChatId },
            { sender: userToChatId, receiver: SenderId }
        ]
     })

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

// 📨 Send a new message
const sendMessage = async (req, res) => {
  try {
    const { roomId, receiver, content, image, video } = req.body;
    const {id: receiverId} = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let videoUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get the secure URL from Cloudinary response
    }

    if (video) {
      const uploadResponse = await cloudinary.uploader.upload(video, { resource_type: 'video' });
        videoUrl = uploadResponse.secure_url; // Get the secure URL from Cloudinary response   
    }

    const newMessage = new Message({
      senderId: req.user.id,
      receiverId,
      content,
      image : imageUrl,
      video :videoUrl,
    });

    await newMessage.save();
    res.status(201).json({ success: true, message});
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

// ✅ Mark all messages as read in a room
const markMessagesAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;

    await Message.updateMany(
      { roomId, receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ success: false, error: "Failed to mark messages as read" });
  }
};

module.exports = {
    getMessages,
    sendMessage,
    markMessagesAsRead
}; 