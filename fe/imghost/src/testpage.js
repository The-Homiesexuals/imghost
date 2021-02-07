import React, {useEffect, useState, useMemo} from 'react';
import ReactS3 from 'react-s3';
import keys from './keys.json';
import { useDropzone } from 'react-dropzone';
import Gluejar from 'react-gluejar';
import axios from 'axios';
import { Container } from 'react-bootstrap';

const textStyling  = {
  color: 'var(--secondary)',
  display:'inline',
  fontSize: '30px'
};
const imageDrop = {
  padding: 0,
  margin: 'auto',
  borderRadius: '20px',
  backgroundColor: 'var( --ternary)',
  maxWidth: '600px',
  maxHeight: '600px',
  lineHeight: '600px',
  // paddingBottom: '300px', // TODO: Investigate why paddingBottom isn't working
  marginTop: 100,
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
  backgroundColor: 'var( --ternary)',
  borderRadius: '20px',
  lineHeight: '200px', 
  marginBottom: '300px' // TODO: Why isn't anything happening?
  
}
const activeDropZone = {

};
const acceptDropZone = {

};
const rejectDropZone = {

};
const disabledDropZone = {
  
}

export default function Test() {
  const [image, setImage] = useState(false);

  const setIMG = function(newImage){
    setImage(newImage);
  }

  return (
    <div style={{textAlign:'center'}}>
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
                if (pic === image) {
                  return (
                    <p style={textStyling}>Paste your screenshot!</p>);
                }
                  setImage(images[0]);
                  return (<p>The user shouldn't see this haha</p>);
              }
              return (<p style={textStyling}>Paste your screenshot!</p>);
            }}
          </Gluejar>
        }
      </Container>
      <p style={textStyling}> Or Alternatively... </p>
        <DropZone setIMG={setIMG} imageIsStored={image !== false}/>
    </div>
  );
}



function DropZone({setIMG, imageIsStored}) {
  const [files, setFiles] = useState([]);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    disabled
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
    maxFiles: 1,
    disabled: imageIsStored
  });

  const style = useMemo(() => ({
    ...dropZone,
    ...(isDragActive ? activeDropZone : {color: 'var(--ternary)'}),
    ...(isDragAccept ? acceptDropZone : {}),
    ...(isDragReject ? rejectDropZone : {})
    ...(disabled     ? disabledDropZone : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  useEffect(() => () => {
    // Revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  // TODO: Set colours if drag was accepted or rejected.
  // Look into disabling dragbox
  return (
    <section className="container">
      <div style={style} {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p style={{...textStyling, ...(isDragActive ? {color: 'green'}: {})}}>
          {isDragActive ? 'Let\'s see it!' :
              isDragAccept ? 'Image Accepted' :
                isDragReject ? 'Image Rejected' :
                  'Drag and drop, or click to select files'}
        </p>
      </div>
    </section>
  );
}