import React, { useEffect } from 'react';
import { Grid, Row, Col, Container, Card} from 'react-bootstrap';
import {useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import axios from 'axios';
const HeaderStyling  = {'color': 'var(--secondary)'};


const cardImage = {
    objectFit: 'cover',
    width: 'auto',
    height: '30vh'
}

const cardStyle = {
    width: '18rem', 
    textAlign:'center', 
    cursor:'pointer'
}

const hoveredCardStyle = {
    width: '18rem', 
    textAlign:'center',
    backgroundColor: 'red'
}
// Card:
// S3 URL (Internal)
// Title 
// Tags
// External url
// Date - Not needed for this

function AllImages() {

    const [hovered, setHovered] = useState(false);
    const [hoveredID, setHoveredId] = useState("");
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/images/',
            response: 'json'
        }).then(function(response){
            setImages(response.data.images);
        }).catch(function(error) {
            alert("There was a problem fetching the images!")
        });
    });

    return (
        <div>
            <Container style={{paddingTop:20}} >
                <Row style={{marginTop:'20'}}>
                    {
                        images.map( imageTemp=>(
                            <Col style={cardStyle}>
                                <Link to={`/image/${imageTemp.imageId}`}>
                                <Card
                                    id = {imageTemp.imageId}
                                    className="my-5" 
                                    style={(hovered && hoveredID===imageTemp.imageId) ? hoveredCardStyle : cardStyle} 
                                    onMouseEnter={() => {
                                        setHovered(true)
                                        setHoveredId(imageTemp.imageId)}} 
                                    onMouseLeave={() => setHovered(false)}>
                                    <Card.Img variant="card-img-top" style = {cardImage} src={imageTemp.S3_URL} />
                                    <Card.Body style={{alignItems:'center'}}>
                                        <Card.Title style={{alignItems:'center'}}>{imageTemp.title}</Card.Title>
                                        <Card.Text>
                                            {imageTemp.tags}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                                </Link>
                            </Col >))
                    }       
                </Row>
            </Container>
        </div>
    )
}

export default AllImages;
