import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactS3 from 'react-s3';
import keys from './keys.json'
import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios'
import axios from 'axios';

const HeaderStyling  = {'color': 'var(--secondary)',display:'inline',float:'none'};

const config = {
  bucketName: 'imghoststoragebucket',
  region: 'ca-central-1',
  accessKeyId: keys.accessKey,
  secretAccessKey: keys.secretKey,
}

export default function Test() {
  return (
    <div style={{textAlign:'center'}}>
      <h4 style={HeaderStyling}> 
        Upload Image Below and Meta-data will be sent to server
        <br/>
        <br/>
        <FileUpload />
      </h4>
    </div>
  )
}

function FileUpload() {

  const [name,setName] = useState("");
  const [tags,setTags] = useState("");

  
  function handleUpload(event) { 
    console.log(event.target.files[0])
    alert(name+" "+tags)
    ReactS3.uploadFile(event.target.files[0],config).then((data)=>{
      console.log(data);
      
      //#IMPORTANT: replace path to server with application you're testing
      axios.put('path_to_server/image', {
        s3bucket : data,
        img_name : name,
        img_tags : tags,
      })
      .then(function (res) {
        console.log(res);
      })
      .catch((err) => {
        alert(err);
      })

    })
    .catch((err)=>{
      alert(err);
    })
  }

  return (
    <div id='upload-box'>
      <form>
        <label>Name:</label><br/>
        <input type="text" value={name} onChange={e => setName(e.target.value)}  /><br/>
        <label>Tags:</label><br/>
        <input type="text" value={tags} onChange={e => setTags(e.target.value)}/><br/><br/>
        <input type="file" onChange={handleUpload}/>
      </form>
    </div>
  )
}