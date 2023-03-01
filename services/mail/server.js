const express = require('express');
const cors = require('cors');
const Mailjet = require('node-mailjet');

const app = express();

app.use(cors({origin:'*'}));

app.use(express.json());

  const mail = Mailjet.apiConnect(
    '2a01e7a75f7d4e8e1727d117ab0f705c',
    '6cf9cf9239a0b061668661431f3033e3',
    {
      config: {},
      options: {}
    } 
);  



const createRequest = (reciepient, image) => {
    return mail
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: "cankillah@gmail.com",
            Name: "Mailjet Pilot"
          },
          To: [
            {
              Email: "cankillah@gmail.com",
              Name: "passenger 1"
            }
          ],
          Subject: "ololo",
          TextPart: "",
          HTMLPart: '<div width="100%" height="100%">' +       '<img src="' + 'https://rivne1.tv//pics2/2303/i143259.JPG' + '" width="' + 300 + 'px" height="' + 300 + 'px">' + '</div>'
        }
      ]
    });
};


        
app.get('/sendmail', (req, res) => {
    createRequest(null, null).then((result) => console.log(result.body)).catch((err) => console.log(err.statusCode));
    res.send(100);
});





app.listen(3000, () => console.log('Example app is listening on port 3000.'));