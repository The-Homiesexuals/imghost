import React, {useEffect, useState} from 'react';
import ReactS3 from 'react-s3';
import keys from './keys.json';
// import { FileDrop } from 'react-file-drop';
import { useDropzone } from 'react-dropzone';
import Gluejar from 'react-gluejar';
import axios from 'axios';
import { Image, Container } from 'react-bootstrap';

const headerStyling  = {color: 'var(--secondary)',display:'inline', };
const imageDrop = {
  padding: 0,
  margin: 'auto',
  // textAlign: 'center',
  backgroundColor: 'var( --ternary)',
  maxWidth: '600px',
  maxHeight: '600px',
  lineHeight: '600px',
  // paddingBottom: '300px', // TODO: Investigate why paddingBottom isn't working
  marginTop: 100,
  // flexShrink: 1,
  // backgroundColor: 'red'
};
const config = {
  bucketName: 'imghoststoragebucket',
  region: 'ca-central-1',
  accessKeyId: keys.accessKey,
  secretAccessKey: keys.secretKey,
};
const img = {
  height: '100%',
  // width: '100%',
  maxWidth: '100%',
  // flexGrow: 1,
  // maxHeight: '50%',
  // backgroundColor: 'red',
  objectFit: 'cover'
};
const dropZone = {
  margin: 'auto',
  height: '200px',
  width: '600px',
  backgroundColor: 'white',
  lineHeight: '200px', 
  marginBottom: '300px' // TODO: Why isn't anything happening?
}

export default function Test() {
  const [image, setImage] = useState(false);

  const setIMG = function(newImage){
    setImage(newImage);
  }

  return (
    <div style={{textAlign:'center', backgroundColor: 'var( --warning)'}}>
      <Container style={imageDrop} >
        {image !== false &&
          <img
            style={img}
            fluid
            src={image} key={image} alt={`Pasted: ${image}`}
          />
        }
        {!image && 
          <Gluejar
            acceptedFiles={['image/gif', 'image/png', 'image/jpeg', 'image/bmp']}
            onPaste={files => console.log(files)} errorHandler={err => console.error(err)}
            style={{
              maxHeight: '100%',
              minHeight: '100%',
              maxWidth: '100%',
              minWidth: '100%',
            }}
          >
            {/* The Gluejar implementation naturally implements a list of images, which isn't what we want */}
            {images => {
              if (images.length > 0) {
                let pic = images[0];
                console.log('image!');
                console.log(pic);
                if (pic === image) {
                  return <p>Paste your screenshot!</p>;
                }
                  setImage(images[0]);
                  return <p>nothing hopefully</p>;
              }
              return <p>Paste your screenshot!</p>;
            }
              // <img src={images[0]} key={images[0]} alt={`Pasted: ${images[0]}`} />
            }
          </Gluejar>
        }
      </Container>
      <p> Or Alternatively </p>
      <div
        style={dropZone}
      >
        <DropZone setIMG={setIMG}/>
        </div>
    </div>
  );
}



function DropZone({setIMG}) {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      // console.log('aceepted files'); console.log(acceptedFiles); console.log('other stuff'); console.log(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file)})));

      // setImage(URL.createObjectURL(acceptedFiles[0]));
      setIMG(URL.createObjectURL(acceptedFiles[0]));
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    maxFiles: 1
  });

  useEffect(() => () => {
    // Revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag and drop, or click to select files</p>
      </div>
    </section>
  );
}