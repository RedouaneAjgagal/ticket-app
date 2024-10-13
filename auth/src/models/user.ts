import mongoose from "mongoose";
import { Password } from "../services";

interface UserAttrs {
    email: string;
    password: string;
}

interface UserStatics extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new mongoose.Schema<UserAttrs>({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
});

userSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password"));
        this.set("password", hashedPassword);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    const user = new User(attrs);
    return user
}

const User = mongoose.model<UserAttrs, UserStatics>("User", userSchema);

export {
    User
}