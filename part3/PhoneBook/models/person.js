import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGODB_URI;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log("error connecting to mongodb:", error.message);
  });

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      required: true,
    },
    number: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{2,3}-\d+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      minLength: 8,
      required: true,
    },
  },
  {
    toJSON: {
      transform: (doc, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
      },
    },
  }
);

export default mongoose.model("Person", personSchema);
