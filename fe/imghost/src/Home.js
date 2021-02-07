import React, {useEffect, useState, useMemo} from 'react';
import ReactS3 from 'react-s3';
import keys from './keys.json';
import { useDropzone } from 'react-dropzone';
import Gluejar from 'react-gluejar';
import axios from 'axios';
import { Container, Form, Row, Col } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const textStyling  = {
  marginTop: '40px',
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
  marginTop: '50px',
};
const config = {
  bucketName: 'imghoststoragebucket',
  region: 'ca-central-1',
  accessKeyId: keys.accessKey,
  secretAccessKey: keys.secretKey,
};
const img = {
  height: '100%',
  maxWidth: '100%',
  objectFit: 'cover'
}; // TODO: Vertical sizing issue
const dropZone = {
  margin: 'auto',
  height: '200px',
  width: '600px',
  backgroundColor: 'var( --ternary)',
  borderRadius: '20px',
  lineHeight: '200px', 
  marginBottom: '300px' // TODO: Why isn't anything happening?
};
// TODO: Figure out this styling
const activeDropZone = {

};
const acceptDropZone = {

};
const rejectDropZone = {

};
const disabledDropZone = {

}

export default function Home() {
  const [image, setImage] = useState(false);

  const setIMG = function(newImage){
    setImage(newImage);
  }

  console.log('image is stored', image !== false);

  return (
    <div style={{textAlign:'center'}}>
      <Container style={imageDrop} >
        {image !== false &&
          <img
            style={img}
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
      <p style={textStyling}> {image === false  ? 'Or Alternatively...' : ''} </p>
        { image === false ?
          <DropZone setIMG={setIMG} imageIsStored={image !== false} /> :
          <Upload />
        }
    </div>
  );
}

function Upload() {

  const [name,setName] = useState('');
  const [tags,setTags] = useState('');


  function handleUpload(event) {
    console.log(event.target.files[0])
    alert(name+' '+tags);
    ReactS3.uploadFile(event.target.files[0],config).then((data)=>{
      console.log(data);

      //#IMPORTANT: replace path to server with application you're testing
      axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/image',
        data: {
          s3bucket : data,
          img_name : name,
          img_tags : tags,
        },
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }).then(function (res) {
        console.log(res);
      })
      .catch((err) => {
        alert(err);
      });

    })
    .catch((err)=>{
      alert(err);
    })
  }

  return (
      <Form
        onSubmit={event=> console.log(event)}
        style={{marginTop: '20px', marginBottom: '100px'}}
      >
          <p style={{...textStyling, lineHeight: '80px'}}>
            Save Image Online
          </p>
        <Form.Row
          className='justify-content-md-center'
          style={{marginBottom: '10px'}}
        >
          <Col md='auto'>
            <Form.Control placeholder='Image Name' />
          </Col>
          <Col md='auto'>
            <Form.Control placeholder='Image Tags (separate with commas)' />
          </Col>
        </Form.Row>
        <Form.Row className='justify-content-md-center'>
          <Button type='submit'>
            Submit Online
          </Button>
        </Form.Row>
      {/* <form>
        <label style={textStyling}>Name:</label><br/>
        <input type='text' value={name} onChange={e => setName(e.target.value)}  /><br/>
        <label style={textStyling}>Tags:</label><br/>
        <input type='text' value={tags} onChange={e => setTags(e.target.value)}/><br/><br/>
      </form> */}
        {/* <input type='file' onChange={handleUpload}/> */}
      </Form>
  )
}

function DropZone({setIMG, imageIsStored}) {
  const [files, setFiles] = useState([]);
  console.log('prop for dropzone', imageIsStored);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      // setImage(URL.createObjectURL(acceptedFiles[0]));
      setIMG(URL.createObjectURL(acceptedFiles[0]));
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
    },
    multiple: false,
  });

  const style = useMemo(() => ({
    ...dropZone,
    ...(isDragActive ? activeDropZone : {color: 'var(--ternary)'}),
    ...(isDragAccept ? acceptDropZone : {}),
    ...(isDragReject ? rejectDropZone : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept,
  ]);

  useEffect(() => () => {
    // Revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  // TODO: Set colours if drag was accepted or rejected.
  // Look into disabling dragbox
  return (
    <section className='container'>
      <div style={style} {...getRootProps({className: 'dropzone disabled'})}>
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