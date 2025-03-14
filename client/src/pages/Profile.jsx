import React from "react";
import {useSelector} from "react-redux";
import { useState } from "react";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutStart, signoutSuccess, signoutFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function Profile() {
    const [formData, setFormData] = useState({});
    const {currentUser, loading, error} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    }
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if(data.success === false){
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        }catch(error){
            dispatch(updateUserFailure(error.message));
            setUpdateSuccess(false);
        }
    }

    const handleDelete = async () => {
        try{
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if(data.success === false){
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess(data));
        }catch(error){
            dispatch(deleteUserFailure(error.message));
        }
    }

    const handleSignOut = async () => {
        try{
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if(data.success === false){
                dispatch(signoutFailure(data.message));
                return;
            }
            dispatch(signoutSuccess(data));
        } catch(error){
            dispatch(signoutFailure(error.message));
        }
    }
    return (
        <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input type="text" placeholder="username" id='username' className="border p-3 rounded-lg" defaultValue={currentUser.username} onChange={handleChange}/>
                <input type="email" placeholder="email" id='email' className="border p-3 rounded-lg" defaultValue={currentUser.email} onChange={handleChange}/>
                <input type="password" placeholder="password" id='password' className="border p-3 rounded-lg" defaultValue={currentUser.password} onChange={handleChange}/>
                <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" disabled={loading}>{loading ? 'Loading...' : 'Update'}</button>
                <Link to={"/create-listing"} className="text-white bg-green-700 p-3 rounded-lg uppercase text-center hover:opacity-95">Create Listing</Link>

            </form>
            <div className="flex justify-between mt-5">
                <span className="text-red-700 cursor-pointer" onClick={handleDelete}>Delete Account</span>
                <span className="text-red-700 cursor-pointer" onClick={handleSignOut}>Sign Out</span>
            </div>
            <p className="text-red-700 mt-5">{error ? error : ''}</p>
            <p className="text-green-700 mt-5">{updateSuccess ? 'Profile updated successfully' : ''}</p>
        </div>
    )
}