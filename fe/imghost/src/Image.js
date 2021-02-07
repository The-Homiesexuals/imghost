import {React,useEffect,useState}from 'react';

import {Row, Col, Container,Image, Jumbotron,Button} from 'react-bootstrap'
import {useParams} from 'react-router-dom'
import axios from 'axios';
import { Redirect,useHistory } from "react-router-dom";

const HeaderStyling  = {
    'color': 'var(--secondary)',
    height:'auto',
    padding:'8px',
    marginTop:'50px',
    borderRadius:'20px'
};

const textStyling  = {
    marginTop: '40px',
    color: 'var(--white)',
    display:'inline',
    fontSize: '30px'
  };

export default function ImagePage() {
    
    const [image,setImage] = useState(0);

    const { imageId } = useParams();

    const history = useHistory();


    useEffect(() => {
        //Here is where we parse server api for GET image with URL input 
        axios({
            method: 'get',
            url: `/image/${imageId}`,
            response: 'json'
        }).then(function(response){
            setImage(response.data);
            console.log("Tags: ",response.data.tags)
        }).catch(function(error) {
            alert("There was a problem fetching the image!")
        });
     },[]);

    return (
      <div>
          <Container style={{height:'100%',minHeight:"90vh"}}>
              <Row md='auto' style={{marginTop:'30px', justifyContent:'center'}}>
                  <Col md='auto' style={{backgroundColor: 'white', textAlign:'center',justifyContent:'center',paddingTop:'10px',paddingBottom:'15px',borderRadius:"15px"}} > 
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
                                {image.tags && image.tags.toString().replace(/,/g, ', ')}
                            </p>
                        </Container>
                    </Jumbotron>
                  </Col>
              </Row>
              <Row style = {{ textAlign:'center', flexShrink:'1'}}>
                  <Col>
                  <Button onClick={() => axios({
                      method: 'delete',
                      url: `http://127.0.0.1:5000/image/${imageId}`,
                    }).then(function(response){
                        history.push('/allimages')
                        //return <Redirect to ="/allimages"/>
                        //alert("Img Deleted!!!")
                    }).catch(function(err) {
                        alert("You were unsuccessful in deleting the image!")

                    })}
                    style={{backgroundColor: 'var( --red)', borderRadius:'10px'}}>
                    <p style={textStyling}>Delete</p>
                    </Button>
                  </Col>
              </Row>
          </Container>
      </div>
    )
  }

  