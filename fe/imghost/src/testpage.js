import React from 'react';
import ReactDOM from 'react-dom';
import ReactS3 from 'react-s3';
import keys from './keys.json'

const HeaderStyling  = {'color': 'var(--secondary)'};

const config = {
  bucketName: 'imghoststoragebucket',
  region: 'ca-central-1',
  accessKeyId: keys.accessKey,
  secretAccessKey: keys.secretKey,
}

export default function Test() {
  return (
    <h4 style={HeaderStyling}> 
      Upload Image Below and Meta-data will be sent to server
      <br/>
      <br/>
      <FileUpload />
    </h4>
  )
}

function FileUpload() {

  function handleUpload(event) { 
    console.log(event.target.files[0])
    ReactS3.uploadFile(event.target.files[0],config).then((data)=>{
      console.log(data);
      
      //#TODO: USE AXIOS TO SEND REQUEST TO BACK END WITH IMAGE INFORMATION

    })
    .catch((err)=>{
      alert(err);
    })
  }

  return (
    <div id='upload-box'>
      <input type="file" onChange={handleUpload} />
    </div>
  )
}