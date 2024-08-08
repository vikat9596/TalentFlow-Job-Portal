import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {  toast} from "react-toastify";
import { clearAllJobErrors, postJob, resetJobSlice } from '../store/slices/jobSlice';
import {CiCircleInfo} from "react-icons/ci"

const JobPost = () => {
  const [title,setTitle] = useState("");
  const [jobType,setJobType] = useState("");
  const [location,setLocation] = useState("");
  const [companyName,setCompanyName] = useState("");
  const [offers,setOffers] = useState("");
  const [introduction,setIntroduction] = useState("");
  const [responsibilities,setResponsibilities] = useState("");
  const [qualifications,setQualifications] = useState("");
  const [jobNiche,setJobNiche] = useState("");
  const [salary,setSalary] = useState("");
  const [hiringMultipleCandidates, setHiringMultipleCandidates] = useState("");
  const [personalWebsiteTitle,setPersonalWebsiteTitle] = useState("");
  const [personalWebsiteUrl,setPersonalWebsiteUrl] = useState("");
  

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  const cities = [
    "Mumbai",
    "Delhi",
    "Bengaluru",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Indore",
    "Thane",
    "Bhopal",
    "Vadodara",
    "Coimbatore",
    "Patna",
    "Chandigarh",
    "Visakhapatnam"
];

const {isAuthenticated,user} = useSelector((state) => state.user);
const {loading,error,message} = useSelector((state) => state.jobs);
const dispatch = useDispatch();

const handlePostJob = (e) => {
  const formData = new FormData();
  formData.append("title",title);
  formData.append("jobType",jobType);
  formData.append("location",location);
  formData.append("companyName",companyName);
  formData.append("introduction",introduction);
  formData.append("responsibilities",responsibilities);
  formData.append("qualifications",qualifications);
  offers && formData.append("offers",offers);
  formData.append("jobNiche",jobNiche);
  formData.append("salary",salary);
  hiringMultipleCandidates && formData.append("hiringMultipleCandidates",hiringMultipleCandidates);
  personalWebsiteTitle && formData.append("personalWebsiteTitle",personalWebsiteTitle);
  personalWebsiteUrl && formData.append("personalWebsiteUrl",personalWebsiteUrl);

  dispatch(postJob(formData));
};

useEffect(() => {
  if(error){
    toast.error(error);
    dispatch(clearAllJobErrors());
  }
  if(message){
    toast.success(message);
    dispatch(resetJobSlice());
  }
}, [dispatch,error,loading,message])



  return (
    <div className='account_components'>
      <h3>Post a Job</h3>
      <div>
        <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Job Title'/>
      </div>
      <div>
        <label>Job Type</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-Time</option>
            <option value="Part-time">Part-Time</option>
          </select>
      </div>
      <div>
        <label>Location (city)</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">Select Location</option>
          {
            cities.map((element,index) => {
              return(
                <option key={index} value={element}>{element}</option>
              )
            })
          }
          </select>
      </div>
      <div>
        <label>Company Name</label>
          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder='Company Name'/>
      </div>
      <div>
        <label>Company/ Job Introduction</label>
          <textarea value={introduction} onChange={(e) => setIntroduction(e.target.value)} rows="7" placeholder='Company/Job Introduction'/>
      </div>
      <div>
        <label>Responsibilities</label>
        <textarea value={responsibilities} onChange={(e) => setResponsibilities(e.target.value)} rows="7" placeholder='Job Responsibilities'/>
      </div>
      <div>
        <label>Qualifications</label>
        <textarea value={qualifications} onChange={(e) => setQualifications(e.target.value)} rows="7" placeholder='Required Qualifications for Job'/>
      </div>
      <div>
        <div className='label-infoTag-wrapper'>
        <label>What We Offer</label>
        <span><CiCircleInfo/>Optional</span>
        </div>
        
        <textarea value={offers} onChange={(e) => setOffers(e.target.value)} rows="7" placeholder='What are we offering in return!'/>
      </div>
      <div>
        <label>Job Niche</label>
        <select value={jobNiche} onChange={(e) => setJobNiche(e.target.value)}>
        <option value="">Select Job Niche</option>
          {
            nichesArray.map((element,index) => {
              return(
                <option key={index} value={element}>{element}</option>
              )
            })
          }
          </select>
      </div>
      <div>
        <label>Salary</label>
          <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder='500000 - 800000'/>
      </div>
      <div>
        <div className='label-infoTag-wrapper'>
        <label>Hiring Multiple Candidates</label>
        <span><CiCircleInfo/>Optional</span>
        </div>
        
        <select value={hiringMultipleCandidates} onChange={(e) => setHiringMultipleCandidates(e.target.value)}>
            <option value="">Select Yes or No</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
      </div>
      <div>
        <div className='label-infoTag-wrapper'>
        <label>Personal Website Name</label>
        <span><CiCircleInfo/>Optional</span>
        </div>
        
        <input type="text" value={personalWebsiteTitle} onChange={(e) => setPersonalWebsiteTitle(e.target.value)} placeholder='Personal Website Name'/>
      </div>
      <div>
        <div className='label-infoTag-wrapper'>
        <label>Personal Website URL</label>
        <span><CiCircleInfo/>Optional</span>
        </div>
        
        <input type="text" value={personalWebsiteUrl} onChange={(e) => setPersonalWebsiteUrl(e.target.value)} placeholder='Personal Website URL'/>
      </div>
      <div>
        <button style={{margin:"0 auto"}} className='btn' onClick={handlePostJob} disabled={loading}>Post Job</button>
      </div>
      

    </div>
  )
}

export default JobPost