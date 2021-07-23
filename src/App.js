import { react } from '@babel/types';
import { Row, Col, Button,Image, Form, Container, Card, Spinner } from 'react-bootstrap'
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
var FormData = require('form-data');
function App() {

  const [images, setImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [base64, setBase64] = useState([])
  const [done, setDone] = useState(true)
  const [load, setLoad] = useState(true)
  const render = (img) => {
    return
    <div>
      <img src={URL.createObjectURL(img)} />
    </div>

  }

  const postimage = (img) => {

    let data = new FormData()
    for (let i = 0; i < img.length; i++) {
      data.append('image', img[i])
    }


    // formdata.append('images',img)
    var config = {
      method: 'post',
      url: "http://localhost:8000/image",
      headers: { "Content-Type": "form-data" },
      data: data
    };

    axios(config)
      .then(function (response) {

        // const result =  JSON.stringify()
        const x = setBase64(response.data)
        //  console.log(response.data);


      }).then(() => {
        setDone(false)
        setLoad(true)
        setSelectedFiles([])
      })



      .catch(function (response) {
        //handle error
        console.log(response);
      });

  }

  const checkimages = () => {
    console.log(images);
  }

  const handleImage = (e) => {
    if (e.target.files.length >= 1) {
      // setDone(!done)
      setBase64([])
      const filesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));

      // console.log("filesArray: ", filesArray);

      // setSelectedFiles((prevImages) => prevImages.concat(filesArray));
      setSelectedFiles(filesArray)
      setImages(e.target.files)
      Array.from(e.target.files).map(
        (file) => URL.revokeObjectURL(file) // avoid memory leak
      );
    }

  }

  function Render_Image() {
    if (images.length != 0) {
      setLoad(false)
      postimage(images)
    } else {
      alert("don't have any image for process")
      // console.log("emtry");
    }

  }

  const Render_Dectect = ({ data }) => {
    // console.log(data);
    return data.map(e => {

      return <Col  >
        
        <Card  style={{margin:'20px',backgroundColor:'#189b06'}}   >
          
          <Card.Header className="Text-Count">นับเสาเข็มได้ {e.count} ต้น</Card.Header>
          <Card.Img variant="top" src={`data:image/png;base64,${e.img}`} key={e.img} width="400px" height="auto" onClick={() => { console.log(e.count); }}  />
        </Card>
        
      </Col>


    })
  }
  const renderPhotos = (source) => {
    // console.log('source: ', source);
    return source.map((photo) => {
      return <Col  > 
        <Card style={{margin:'20px'}}>
          
          <Card.Img variant="top" src={photo} alt="" key={photo} width="400px" height="auto" />
        </Card>
      </Col>

    });
  };

  return (

    <div>
      <div className="Header">
        ระบบตรวจจับเสาเข็ม
      </div>



      <Row  >
        <Col className="button-Upload" >
          <Button variant="primary" className="Button-Upload-Margin">
            <label>
              Upload Images
              <input type="file" multiple onChange={handleImage} />
            </label>
          </Button>

        </Col>

        <Col className="button-Upload" >

          <Button variant="primary" className="Button-Upload-Margin" onClick={Render_Image} >
            <label>
              Render Images
            </label>
          </Button>

        </Col>


      </Row>


      <Row xs={1} md={2} xl={4} >

        {renderPhotos(selectedFiles)}
        {!done ? <Render_Dectect data={base64} /> : <div></div>}
      </Row>


      <Row  sm={2} xl={4} >



        {!load ? <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
          : <div></div>}

      </Row>

      

    </div>
  );
}

export default App;
