const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log(`connecting to ${url}`);

mongoose
  .connect(url)
  .then(() => console.log("Connected to MONGODB"))
  .catch(() => console.log("Unable to connect to MONGODB for some reason"));

const personSchema = new mongoose.Schema({
  name: { type: String, minlength: 5, required: true },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (x) {
        if (x.split("-")[0].length === 2 || x.split("-")[0].length === 3) {
          return true;
        } else return false;
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "User phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
module.exports = mongoose.model("Person", personSchema);
