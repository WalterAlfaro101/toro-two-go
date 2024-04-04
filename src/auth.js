//Handles Sign in and out of CSUDH email
import { useState } from "react";
import {auth, googleProvider} from "./firebase-config";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut} from "firebase/auth";
import './auth.css';

export const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const CreateUser = async() =>{
        try{
            await createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                localStorage.setItem("name", email);
                localStorage.setItem("email", email);
            })
        }
        catch(err) {console.error(err);}
    }

    const signIn = async() =>{
        try{
            await signInWithEmailAndPassword(auth, email, password)
            .then((result) => {
                localStorage.setItem("name", email);
                localStorage.setItem("email", email); 
            })
        }
        catch(err) {console.error(err);}
    }

    const signInGoogle = async() =>{
        try{await signInWithPopup(auth, googleProvider)
        .then((result) => {
            localStorage.setItem("name", result.user.displayName);
            localStorage.setItem("email", result.user.email);
        })
        }
        catch(err) {console.error(err);}
    }

    const signOut = async() =>{
        try{await signOut(auth);
            localStorage.setItem("name", "Goodbye!");
            localStorage.setItem("email", null);
        }
        catch(err) {console.error(err);}
    }

    return (
        <div>
        <input placeholder="Email..." onChange={(e)=>setEmail(e.target.value)}/>
        <input placeholder="Password..." type="password" onChange={(e)=>setPassword(e.target.value)}/>
        <button onClick={signIn}>Sign In</button>
        <button onClick={CreateUser}>Create New User</button>
        <button onClick={signOut}>SignOut</button>
        <h1>
        <button class="login-with-google-btn" onClick={signInGoogle}>Sign In</button>
        <button class="logOut-with-google-btn" onClick={signOut}>Sign Out</button>
        </h1>
        </div>
    );
}