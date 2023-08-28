import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: [true, "Name is required!"] },
    username: { type: String, required: [true, "Email is required!"], unique: [true, "Email already exists!"] },
    password: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User"}],
    profileUrl: { type: String },
    friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: "User"}],
    friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: "User"}],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post"}],

})

const User = models.User || model("User", UserSchema);

export default User;