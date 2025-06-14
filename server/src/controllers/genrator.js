import Gimini from "../Schema/GiminiModel.js"



export const GenrateDiscription = async (req, res) => {
  try {
    const {prompt} = req.body;
    let content;
    const newGiminiModel = new Gimini({
      user: user._id,
      prompt: {
        text: prompt
      },
      content: content,
      history: []
    })
    
    
    await newGiminiModel.save()
    
    
    res.status(200).json({
      message: newGiminiModel,
    })
    
  } catch (e) {
    console.log(e.message)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}