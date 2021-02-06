import './allimages.css'
import React from 'react';
import { Grid, Row, Col, Container, Card} from 'react-bootstrap';
import images from './images.json' //TODO: Remove before final and replace with server call
import {useState} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
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