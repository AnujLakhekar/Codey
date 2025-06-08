import User from "../Schema/User.js"


export const FindUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = req.user;
    
    const userFound = await User.findOne({ "personal_info.username": id}).select("-password")
    
    
    if (!userFound) {
      return res.status(400).json({
        message: "User not found"
      })
    }
    
  
   res.status(200).json({
     message: userFound
   })
    
  } catch (e) {
    console.log(e.message)
    res.status(400).json({
      error: e.message
    })
  }
}

export const updateUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = req.user;
    
    const userFound = User.findOne({_id: user._id}).select("-password")
    
    
    if (userFound) {
      return res.status(400).json({
        message: "User not found"
      })
    }
    
  
   res.status(200).json({
     message: userFound
   })
    
  } catch (e) {
    console.log(e.message)
    res.status(400).json({
      error: e.message
    })
  }
}

