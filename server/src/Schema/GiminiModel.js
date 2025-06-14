import mongoose from "mongoose"



const GiminiModel = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  prompt: {
    text: {
    type: "String",
    default: null,
    },
    image: {
    type: "String",
    default: null,
    }
  },
  content: {
    text: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    }
    },
  history: [],
}, {
  timestamps: true,
})


const Gimini = mongoose.model("Gimini", GiminiModel)


export default Gimini