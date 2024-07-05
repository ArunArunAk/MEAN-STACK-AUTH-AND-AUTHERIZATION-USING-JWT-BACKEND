const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true ,
        minlength:4
    },
    email: {
        type: String,
        required: true,
        unique: true ,

    },
    password: {
        type: String,
        required: true,
        minlength:4

    },
    profileImage: {
    type: String,
     required: false,
     default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkxmFoNfbURtlwEXGH7NCq-iQY13GNLDt1A4HavEvdsA&s' 
    },
    isAdmin: {
        type: Boolean,
      required: false,
      default:false
    },
    roles: {
        type: [Schema.Types.ObjectId], 
        required: true,
        ref: "Role"
    },
}, {
    timestamps: true 
});


module.exports = mongoose.model("User", UserSchema);
