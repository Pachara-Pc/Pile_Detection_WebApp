var axios = require('axios');
var FormData = require('form-data');
var fs = require('fs');
var data = new FormData();
data.append('file', fs.createReadStream('/C:/Users/Pachara/Desktop/test Model/2_7_Drone_Veiw/test/test (9).jpg'));
data.append('file', fs.createReadStream('/C:/Users/Pachara/Desktop/test Model/2_7_Drone_Veiw/test/test (10).jpg'));


console.log(data);
var config = {
  method: 'post',
  url: '127.0.0.1:8000/files',
  headers: { 
    ...data.getHeaders()
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
