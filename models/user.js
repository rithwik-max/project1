const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); 

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    // ADD THESE ↓
    profileImage: {
        url: { type: String, default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
        filename: { type: String }
    },
    bio: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(passportLocalMongoose.default || passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);