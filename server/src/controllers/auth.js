import mongoose from "mongoose"
import User from "../Schema/User.js"
import bcrypt from "bcryptjs"
import {nanoid} from "nanoid"
import generateToken from "../libs/Token.js"



let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; 


async function GenerateUsername(email) {
  let username = email.split("@")[0];
  
  var isUserNameUnique = await User.find({"personal_info.username": username})
  
  if (isUserNameUnique) {
    const id = nanoid().substring(0, 5);
    username = `${username}-${id}`
  }
  
  return username
}


export const signup = async (req, res) => {
  try {
  const { fullname, email, password } = req.body; 

   if (!fullname || !email || !password) {
     return res.status(400).json({
       message: "All Inputs are required"
     })
   }
   
   
   if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "email sholud contain vaild domain and charectors"
    })
   }
   
   if (!passwordRegex.test(password)) {
     return res.status(400).json({
       message: "Password should bettween 6 to 10 char with a numeric, 1 uppercase and 1 lowercase charectar"
     })
   }
   
   // creating secure password
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)
    
    let username = await GenerateUsername(email);
  
  let newUser = new User({
    personal_info: {
      fullname,
      username,
      email,
      password: hashedPassword,
    }
  })
  
  generateToken(newUser._id, res);
  
  await newUser.save().then(u => {
    
   
   const securedUsr = newUser.personal_info.toObject();
   delete newUser.personal_info.password;
   
   return res.status(200).json({
    user: securedUsr,
  })
    }).catch(e => {
      console.log("[ERROR IN SIGNUP CONTROLLER AUTHENTICATION PROCESS]")
      if (e.message.includes("E11000")) {
        return res.status(400).json({
       message: "User with this email exists!"
     })
      }
     return res.status(400).json({
       message: e.message
     })
    })
  } catch (e) {
    console.log("[ERROR IN AUTH ROUTE SIGNUP]", e.message)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const signin = async (req, res) => {
  try {
    const {email, password} = req.body;
    
    var user = await User.findOne({"personal_info.email": email});
    
    if (!user) {
      return res.status(400).json({
        message: "Invaild credentials"
      })
    }
    
    const isPasswordVaild = await bcrypt.compare(password, user.personal_info.password);
    
    if (!isPasswordVaild) {
      return res.status(400).json({
        message: "Invaild credentials"
      })
    }
    user.personal_info.password = ""
   const newUser = user;
    generateToken(newUser._id, res);
    
    res.status(200).json({
    user: newUser
  })
    
  } catch (e) {
    console.log("[ERROR IN AUTH ROUTE LOGIN]", e.message)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const getMe = (req, res) => {
  try {
    const user = req.user;
    
    if(!user) {
      return res.status(400).json({
        message: "Internal server error - user not found"
      })
    }
    
    res.status(200).json({
        user: user,
      })
    
  } catch (e) {
    console.log("[ERROR IN AUTH ROUTE GETME]", e.message)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const logout = async (req, res) => {
  try  {
    res.cookie("jwt", "", {maxAge: 0});
    res.status(200).json({
      message: "user logout!"
    })
  } catch (e) {
    console.log("[ERROR IN AUTH ROUTE logout]", e.message)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export const google = async (req, res) => {
  try {
    const {email,emailVerified,fullname, uid} = req.body;
    
    if (!email || !emailVerified || !fullname || !uid) {
      return res.status(400).json({
        message: "Invaild input from google auth"
      })
    }
    
    let oldUserFound = await User.findOne({"personal_info.email": email});
    
    
  if (oldUserFound) {
      delete oldUserFound.personal_info.password
      
      generateToken(oldUserFound._id, res);
      
    return res.status(200).json({
        user: oldUserFound
      })
    }
    
    const username = await GenerateUsername(email);
    
  let newUser = new User({
    personal_info: {
      fullname,
      username,
      email,
      password: uid,
    },
    google_auth: true,
  }) 
  
  generateToken(newUser._id, res);
  
  newUser.save()
  
  newUser.personal_info.password = ""
  
  res.status(200).json({
    user: newUser,
  })
  } catch (e) {
    console.log("[ERROR IN AUTH ROUTE GOGGLE]", e.message)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}