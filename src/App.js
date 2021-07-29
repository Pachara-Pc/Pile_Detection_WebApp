import { Row, Col, Button, Card, Spinner } from 'react-bootstrap'
import { useState } from 'react';
import axios from 'axios';
import camera from './icon/camera.png'
import drone from './icon/drone.png'
import './App.css'
var FormData = require('form-data');
function App() {

  const [images, setImages] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [base64, setBase64] = useState([])
  const [done, setDone] = useState(true)
  const [load, setLoad] = useState(true)
  const [toggleMode,setToggelmode] = useState(true)



  const Mode = () =>{
    return toggleMode?"http://localhost:8000/image/humanVeiw":"http://localhost:8000/image/droneVeiw"
  }

  const postimage = (img) => {

    let data = new FormData()
    for (let i = 0; i < img.length; i++) {
      data.append('image', img[i])
    }


    // formdata.append('images',img)
    var config = {
      method: 'post',
      url: Mode(),
      headers: { "Content-Type": "form-data" },
      data: data
    };

    axios(config)
      .then(function (response) {

        // const result =  JSON.stringify()
        setBase64(response.data)
        //  console.log(response.data);


      }).then(() => {
        setDone(false)
        setLoad(true)
        setImages([])
        setSelectedFiles([])
      })



      .catch(function (response) {
        //handle error
        console.log(response);
      });

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
    if (images.length !== 0) {
      setLoad(false)
      postimage(images)
    } else {
      alert("don't have any image for process")
      // console.log("emtry");
    }

  }

  const colorTag = (num) => { return num === 0 ? '#DD3712' : '#189b06' }

  const RenderDectect = ({ data }) => {
    // console.log(data);
    return data.map(e => {

      return <Col  >
        
        <Card  style={{margin:'20px',backgroundColor:colorTag(parseInt(e.count))}}   >
        
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
      <Row  className="Header" >
        <Col sm={9} md={10} xl={11} >
        ระบบตรวจจับเสาเข็ม
        </Col>

        <Col sm={3} md={2} xl={1}>
          {toggleMode?<img class="Icon"src={camera} width="90px" alt="" onClick={()=>setToggelmode(!toggleMode)} />:<img class="Icon"src={drone} width="90px" alt="" onClick={()=>setToggelmode(!toggleMode)} /> }
        </Col>
      </Row>
      



      <Row  >
        <Col className="button-Upload" >
          <Button variant="primary" className="Button-Upload-Margin">
            <label style={{cursor: "pointer"}}>
              Upload Images
              <input type="file" multiple onChange={handleImage} />
            </label>
          </Button>

        </Col>

        <Col className="button-Upload" >

          <Button variant="primary" className="Button-Upload-Margin" onClick={Render_Image} >
            <label style={{cursor: "pointer"}} >
              Render Images
            </label>
          </Button>

        </Col>


      </Row>


      <Row xs={1} md={2} xl={4} >

        {renderPhotos(selectedFiles)}
        {!done ? <RenderDectect data={base64} /> : null}
      </Row>




        {!load ? 
        <div className="Load-Screen" >
          <Spinner variant="light"  animation="border" role="status" id="Load-Screen-Icon" >
          <span className="visually-hidden" >Loading...</span>
        </Spinner>
        </div>
          : <div ></div>}

 
      

    </div>
  );
}

export default App;
