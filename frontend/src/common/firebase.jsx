// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, deleteUser } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGEID,
  appId: import.meta.env.VITE_FIREBASE_APPID
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
