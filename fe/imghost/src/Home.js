import React, {useEffect, useState, useMemo} from 'react';
import S3 from 'react-aws-s3';
import keys from './keys.json';
import { useDropzone } from 'react-dropzone';
import { useHistory } from 'react-router-dom';
import Gluejar from 'react-gluejar';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Button, Container, Form, Col } from 'react-bootstrap';

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
  borderWidth: '2px',
  borderColor: 'white',
  lineHeight: '200px', 
  marginBottom: '300px' // TODO: Why isn't anything happening?
};
// TODO: Figure out this styling
const activeDropZone = {

};

export default function Home() {
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
          <DropZone setIMG={setIMG}/> :
          <Upload image={image} />
        }
    </div>
  );
}

function Upload({image}) {

  const [name,setName] = useState('');
  const [tags,setTags] = useState('');

  const history = useHistory();

  async function handleUpload(name, tags) {
    const file = await fetch(image).then( r=> r.blob());

    const ReactS3Client = new S3(config);
    
    const randID = uuidv4();
    let res;
    try {
      res = await ReactS3Client.uploadFile(file, randID);
      console.log(res);
    }
    catch (e) {
      alert('Something went wrong uploading, please try again.');
      return;
    }

      //#IMPORTANT: replace path to server with application you're testing
      let serverRes;
      
      try {
        serverRes= await axios({
          method: 'post',
          url: 'http://127.0.0.1:5000/image',
          data: {
            s3bucket : res,
            img_name : name,
            img_tags : tags,
          },
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        });
        console.log(serverRes);
      } catch(e) {
        alert('Something went wrong uploading, please try again.');
      }
      let newUrl = '/image/'+serverRes.data.imageId;
      history.push(newUrl)
  }
  
  return (
      <Form
        onSubmit={event=> {
          event.preventDefault();
          handleUpload(name, tags);
        }}
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
            <Form.Control onInput={val=> {setName(val.target.value)}} placeholder='Image Name' />
          </Col>
          <Col lg='2'>
            <Form.Control onInput={val=> {setTags(val.target.value)}} placeholder='Image Tags (separate with commas)' />
          </Col>
        </Form.Row>
        <Form.Row className='justify-content-md-center'>
          <Button 
            style={{backgroundColor: 'var( --warning)'}}
            type='submit'
          >
            <p
              style={{...textStyling, color: 'var( --primary)',
              }}
            >
              Submit Online
            </p>
          </Button>
        </Form.Row>
      </Form>
  )
}

function DropZone({setIMG}) {
  const [files, setFiles] = useState([]);
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
    ...(isDragActive ? activeDropZone : {color: 'var(--ternary)', borderColor: 'green', borderWidth: '2px 2px 2px 2px'}),
  }), [isDragActive]);

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