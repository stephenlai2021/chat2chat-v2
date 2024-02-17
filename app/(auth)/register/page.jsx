"use client";

/* react */
import { useState, useRef } from "react";

/* next */
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* utils */
import { toast } from "react-hot-toast";

/* supabase */
import useSupabaseClient from "@/lib/supabase/client";

/* firebase */
import {
  auth,
  googleAuthProvider,
  firestore,
  storage,
} from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/* react-icons */
import { IoCloseCircleOutline } from "react-icons/io5";
import { AiOutlineCloudUpload } from "react-icons/ai";

function Main() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showUploadBtn, setShowUploadBtn] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const router = useRouter();
  const inputFile = useRef(null);
  const supabase = useSupabaseClient();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setFile(selectedFile);
    } else {
      setFile(null);
      return;
    }

    // Display image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setShowUploadBtn(true);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }
    setShowUploadBtn(false);

    const storageRef = ref(storage, `${name}/avatar/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error.message);
      },
      () => {
        // Upload complete, get download URL and log it
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // Reset file && upload progress state and update message with download URL
          setFile(null);
          setUploadProgress(0);
          console.log("File available at", downloadURL);

          // setImage(downloadURL);
          setAvatarUrl(downloadURL);
          console.log("image | downloadURL: ", downloadURL);

          // Clear image preview
          setImagePreview(null);
          inputFile.current.value = "";
          document.getElementById("dashboard").close();
        });
      }
    );
  };

  const closeAndClearModal = () => {
    inputFile.current.value = "";
    setImagePreview(null);
    document.getElementById("dashboard").close();
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
      setLoading(false);
    }
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
      setLoading(false);
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      setLoading(false);
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      setLoading(false);
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setLoading(true);

    // try {
    //   if (validateForm()) {
    //     const { data, error  } = await supabase.auth.signUp({
    //       email,
    //       password,
    //       options: { emailRedirectTo: "http://localhost:3000" }
    //     });
    //     if (data) console.log('signup | data: ', data?.user)
    //     if (error) {
    //       console.log('signup | error: ', error)
    //       return
    //     }

    //     /* create user data with firestore */
    //     const docRef = doc(firestore, "users", email);
    //     await setDoc(docRef, {
    //       id: data?.user?.id,
    //       name,
    //       email,
    //       avatarUrl,
    //     });
    //     console.log('You are online')

    //     router.push("/");
    //     setErrors({});
    //   }
    // } catch (error) {
    //   console.error("Error registering user:", error.message);
    //   toast.error(error.message);
    //   setErrors({});
    // }
    // setLoading(false);

    if (validateForm()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        // options: { emailRedirectTo: "http://localhost:3000/confirm" },
        options: { emailRedirectTo: "http://localhost:3000" },
      });

      if (error) {
        console.log("signup error: ", error);
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (data?.user === null) return;

      const docRef = doc(firestore, "users", email);
      await setDoc(docRef, {
        id: data?.user?.id,
        name,
        email,
        avatarUrl,
      });
      console.log("user data created !");
      setConfirm(true)
      // router.push("/");
    }
  };

  if (confirm) return (<>
    <div className="h-screen flex items-center justify-center">
      Please check your email box to confirm your signup
    </div>
  </>)

  return (
    <div className="flex justify-center items-center h-screen font-primary px-8">
      {/*form*/}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full h-full max-w-[600px] pt-10 pl-10 pr-10 form-padding"
      >
        <h1 className="font-secondary text-xl text-center font-semibold text-base-content">
          CHAT<span className="font-bold text-[#eeab63ff]">2</span>CHAT
        </h1>

        {/* Display the avatar and upload button */}
        <div className="flex items-center space-y-2 justify-between p-2">
          <img
            src={avatarUrl ? avatarUrl : "./avatar.png"}
            alt="Avatar"
            className="rounded-full h-[50px] w-[50px]"
          />
          <button
            type="button"
            className="btn btn-outlin btn-info btn-md"
            onClick={() => document.getElementById("dashboard").showModal()}
          >
            Upload Image
          </button>
        </div>

        {/* Name */}
        <div>
          <label>
            <span className="text-base label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="w-full input input-bordered rounded-md text-base-content pl-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>

        {/* Email */}
        <div>
          <label>
            <span className="text-base label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="w-full input input-bordered rounded-md text-base-content pl-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        {/* Password */}
        <div>
          <label>
            <span className="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full input input-bordered rounded-md text-base-content pl-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label>
            <span className="text-base label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full input input-bordered rounded-md text-base-content pl-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        <div>
          <button type="submit" className="btn btn-block btn-accent">
            {loading ? (
              <span className="loading loading-spinner loading-sm text-base-content"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        <span className="text-base-content">
          Already have an account?{" "}
          <Link href="/login" className="text-base-content hover:underline">
            Login
          </Link>
        </span>
      </form>

      {/* image preview modal */}
      {/* <dialog id="dashboard" className="modal">
        <div className="modal-box relative">
          <form method="dialog" className="flex justify-center">
            {imagePreview && (
              <div className="relative">
                <img
                  src="./upload-icon.png"
                  alt="upload icon"
                  className="w-[40px] absolute top-[-20px] left-[50%] translate-x-[-50%] hover:cursor-pointer"
                  onClick={handleUpload}
                />
                <div className="flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Uploaded"
                    className="max-h-60 max-w-xs mb-4 rounded"
                  />
                </div>
                <progress
                  value={uploadProgress}
                  className="progress progress-primary absolute bottom-0 left-0 z-50"
                  max="100"
                ></progress>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={inputFile}
              className="text-primary-content mt-2 file-input file-input-bordered file-input-primary w-full max-w-xs"
              onChange={handleFileChange}
            />
          </form>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute top-0 right-2 top-2"
            onClick={closeAndClearModal}
          >
            ✕
          </button>
        </div>
      </dialog> */}

      <dialog id="dashboard" className="modal">
        <div className="modal-box">
          {/* close button */}
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={closeAndClearModal}
          >
            ✕
          </button>

          <div className="pt-2 relative flex flex-col justify-center items-center">
            {/* image preview section */}
            {imagePreview && (
              <div className="relative">
                <div className="flex justify-center relative">
                  {/* upload icon */}
                  {showUploadBtn && (
                    <div className="backdrop-opacity-30 backdrop-invert bg-base-100/30 rounded-full p-1 w-16 h-16 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] hover:cursor-pointer">
                      <AiOutlineCloudUpload
                        className="text-base-content w-full h-full"
                        onClick={handleUpload}
                      />
                    </div>
                  )}

                  {/* image preview */}
                  <Image
                    src={imagePreview}
                    alt="Uploaded"
                    width={200}
                    height={200}
                    className="mb-4 rounded"
                  />

                  {/* radial progress */}
                  {uploadProgress !== null && (
                    <div
                      className="w-16 h-16 backdrop-opacity-30 backdrop-invert bg-base-100/30 radial-progress text-base-content absolute z-[500] top-[50%] translate-y-[-50%]"
                      style={{ "--value": uploadProgress }}
                      role="progressbar"
                    >
                      {uploadProgress.toFixed(0)}%
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* file input section */}
            <input
              type="file"
              accept="image/*"
              ref={inputFile}
              className="mt-2 file-input file-input-bordered file-input-primary text-base-content w-full max-w-xs"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default Main;
