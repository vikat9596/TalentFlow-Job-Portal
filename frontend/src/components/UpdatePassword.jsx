import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUser } from "../store/slices/userSlice";
import { updatePassword,clearAllUpdateProfileErrors } from '../store/slices/updateProfileSlice';
import {FaRegEyeSlash, FaEye} from "react-icons/fa";

const UpdatePassword = () => {
  const [oldPassword,setOldPassword] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [showPassword,setShowPassword] =useState(false)

  const {user} =useSelector(state => state.user);
  const {loading,error,isUpdated} =useSelector((state) => state.updateProfile);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("oldPassword",oldPassword);
    formData.append("newPassword",newPassword);
    formData.append("confirmPassword",confirmPassword);
    dispatch(updatePassword(formData));
  }

  useEffect(() => {
    if(error){
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
      if(isUpdated){
        toast.success("Password Updated");
        dispatch(getUser());
        dispatch(clearAllUpdateProfileErrors());
      }
    }
  ,[dispatch,loading,error,isUpdated])

  return (
    <div className='account_components update_password_component'>
      <h3>Update Password</h3>
      <div>
        <label>Current Password</label>
          <input type={showPassword? "text" : "password"} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          {
            showPassword ?  <FaRegEyeSlash className='eye_icon' onClick={() => setShowPassword(!showPassword)}/> : <FaEye className='eye_icon' onClick={() => setShowPassword(!showPassword)}/>
          }
        
      </div>
      <div>
        <label>New Password</label>
          <input type={showPassword? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          {
            showPassword ?  <FaRegEyeSlash className='eye_icon' onClick={() => setShowPassword(!showPassword)}/> : <FaEye className='eye_icon' onClick={() => setShowPassword(!showPassword)}/>
          }
        
      </div>
      <div>
        <label>Confirm Password</label>
          <input type={showPassword? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {
            showPassword ?  <FaRegEyeSlash className='eye_icon' onClick={() => setShowPassword(!showPassword)}/> : <FaEye className='eye_icon' onClick={() => setShowPassword(!showPassword)}/>
          }
        
      </div>
      <div className='save_change_btn_wrapper'>
          <button className='btn' onClick={handleUpdatePassword} disabled={loading}>Update Password</button>
      </div>
    </div>
  )
}

export default UpdatePassword