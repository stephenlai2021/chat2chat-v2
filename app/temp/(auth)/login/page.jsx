"use client";

import { useState, useEffect } from "react";
import { account, ID } from "../appwrite";

/* firebase */
import { auth, googleAuthProvider, firestore } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";

/* next */
import { useRouter } from "next/navigation";
import Link from "next/link";

/* supabase */
import useSupabaseClient from "@/lib/supabase/client";

/* utils */
import { toast } from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

function Main() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const supabase = useSupabaseClient();

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
      setLoading(false);
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      setLoading(false);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const setUserStatusOnline = async (user) => {
    /* 把 users colletion 的用戶狀態設置為 "online" */
    const loginUserRef = doc(firestore, "users", user.email);
    await updateDoc(loginUserRef, { status: "online" });
    console.log("You are online");

    /* 把 chatrooms colletion 的用戶狀態設置為 "online" */
    const chatroomsQuery = query(
      collection(firestore, "chatrooms"),
      where("users", "array-contains", user.id)
    );
    const querySnapshot = await getDocs(chatroomsQuery);
    querySnapshot.forEach(async (document) => {
      console.log(document.id, document.data());
      await updateDoc(doc(firestore, "chatrooms", document.id), {
        [`usersData.${user.id}.status`]: "online",
      });
    });
  };

  const handleLogin = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    if (validateForm()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("login error", error);
        toast.error(`${error.message}: either email or password is wrong !`);
        setLoading(false);
        return;
      }

      if (data?.user === null) return;

      router.push("/");
    }
  };

  const handleAppwriteLogin = async (evt) => {
    evt.preventDefault()
    setLoading(true);

    if (validateForm()) {
      try {
        await account.createEmailPasswordSession(email, password);
        setLoggedInUser(account.get())
        console.log(loggedInUser)
        router.push("/")
      } catch (e) {
        console.log(e)
      }
    }
  };

  const signInWithGoogle = async () => {
    console.log("Sign in with Google!");
  };

  // if (loggedInUser) router.push("/")

  return (
    <div className="flex flex-col justify-center items-center h-screen font-primary px-8">
      <form
        // onSubmit={() => handleAppwriteLogin(email, password)}
        className="space-y-4 w-full max-w-[600px] pt-10 pl-10 pr-10 form-padding"
      >
        {/* Title */}
        <h1 className="font-secondary text-xl text-center font-semibold text-base-content">
          CHAT<span className="font-bold text-[#eeab63ff]">2</span>CHAT
        </h1>

        {/* Email */}
        <div>
          <label className="labe">
            <span className="text-base label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        {/* Password */}
        <div>
          <label className="labe">
            <span className="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        {/* Signin Button */}
        <div>
          <button
            type="button"
            onClick={() => handleAppwriteLogin(email, password)}
            className={`${
              loading ? "btn-disabled" : ""
            } btn btn-block btn-accent text-accent-content rounded-xl`}
          >
            <span>Sign in</span>
            {loading && (
              <span className="loading loading-spinner loading-xs text-accent-conten ml-2"></span>
            )}
          </button>
        </div>

        {/* Register link  */}
        <span className="text-base-content">
          Don't have an account?{" "}
          <Link href="/register" className="text-base-content hover:underline">
            Register
          </Link>
        </span>
      </form>

      {/* Signin with Google Button   */}
      <div className="max-w-[600px] w-full px-10 form-padding">
        <div className="divider divider-base-300 text-base-content">OR</div>
        <button
          className="btn bg-info text-info-content w-full rounded-xl"
          onClick={() => signInWithGoogle()}
        >
          <FcGoogle className="w-[20px] h-[20px]" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Main;
