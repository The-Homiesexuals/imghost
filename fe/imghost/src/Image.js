import {React,useEffect,useState}from 'react';

import {Row, Col, Container,Image, Jumbotron} from 'react-bootstrap'
import {useParams} from 'react-router-dom'
import axios from 'axios';


const HeaderStyling  = {
    'color': 'var(--secondary)',
    height:'auto',
    padding:'8px',
    marginTop:'50px',
};

export default function ImagePage() {
    
    const [image,setImage] = useState(0);

    const { imageId } = useParams();

    useEffect(() => {
        //Here is where we parse server api for GET image with URL input 
        axios({
            method: 'get',
            url: `http://127.0.0.1:5000/image/${imageId}`,
            response: 'json'
        }).then(function(response){
            setImage(response.data);
        }).catch(function(error) {
            alert("There was a problem fetching the image!")
        });
     },[]);

    return (
      <div>
          <Container style={{height:'100%',minHeight:"90vh"}}>
              <Row md='auto' style={{marginTop:'30px', justifyContent:'center'}}>
                  <Col md='auto' style={{backgroundColor: 'white', textAlign:'center',justifyContent:'center',paddingTop:'10px',paddingBottom:'15px'}} > 
                      <Image src={image.S3_URL} style={{margin:'auto',maxHeight:'50vh',maxWidth:'30vw'}} rounded/>
                  </Col>
              </Row>
              <Row style = {{ textAlign:'center', flexShrink:'1'}}>
                  <Col>
                    <Jumbotron style = {HeaderStyling}>
                        <Container >
                            <h2>{image.title}</h2>
                            <p>
                                Uploaded on {image.date}
                            </p>
                            <p>
                                [{image.tags}]
                            </p>
                        </Container>
                    </Jumbotron>
                  </Col>
              </Row>
          </Container>
      </div>
    )
  }