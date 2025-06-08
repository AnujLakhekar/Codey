// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, deleteUser } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2NeU15ttws_kn9EMODul9B_sqtW-CHZg",
  authDomain: "codey-5254c.firebaseapp.com",
  projectId: "codey-5254c",
  storageBucket: "codey-5254c.firebasestorage.app",
  messagingSenderId: "646123572023",
  appId: "1:646123572023:web:ddd2ffcbfdef8ac60d28b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth()
const provider = new GoogleAuthProvider()


async function RequestTokenKey(u) {
  try {
  
    const formdata = {
      email: u.user.email,
      emailVerified: u.user.emailVerified,
      fullname: u.user.displayName,
      uid: u.user.uid,
    }
    
    console.log(formdata)
    
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formdata),
      credentials: "include",
    })
    
    const data = await res.json();
    
     await deleteUser(auth.currentUser)
    
    window.location.href = "/"
    
    return data
  } catch (e) {
    console.log(e.message)
  }
}




export async function SignInWithGoogle() {
  try {
    let user = null;
    await signInWithPopup(auth, provider).then( async (u) => {
      await RequestTokenKey(u);
    }) 
  
    
    
    return user
  } catch (e) {
    console.error(e.message)
  }
}
