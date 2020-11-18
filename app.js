const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
const url = "https://usX.api.mailchimp.com/3.0/lists/{listId}"; // ending number in the url represents the list we would like to POST to..
const options = {
  method: 'POST',
  auth: "tomerguttman:{YOUR API KEY}" // change X in the url to the ending digit of your API key
};

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true})); //for parsing the 'post' request.

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  var subscriberData =  {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(subscriberData); // what were sending to mailchimp
  const request = https.request(url, options, (response) => {
    if(response.statusCode === 200) { res.sendFile(__dirname + "/success.html"); }
    else { res.sendFile(__dirname + "/failure.html"); }
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || port, () => {
  console.log(`Express server is running on http://localhost:${port}`);
});
