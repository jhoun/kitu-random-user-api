const express = require('express');
const router = express.Router();
const db = require('../db/userData');
const axios = require('axios');

const makeRequestArr = (numOfCalls, urlEndpoint) => {
  return [...new Array(numOfCalls)].map(() => {
    return axios.get(urlEndpoint)
  })
}

router.get('/', async (req, res) => {
  try {
    const [...response] = await axios.all(makeRequestArr(10, 'https://randomuser.me/api'));
    [...response].map((data) => {
      const { gender, name, location, email, cell } = data.data.results[0];
      const userObj = {
        gender: gender,
        firstname: name.first,
        city: location.city,
        email: email,
        cell: cell
      }
      db.userData.push(userObj);
    })
    return res.status(200).send(db.userData);
  } catch(err) {
    console.log('err', err);
    return res.status(404).send({message: 'Users not found'});
  }
})

router.get('/firstname/:firstname', (req, res) => {
  const firstName = db.userData.filter(data => {
    return data.firstname === req.params.firstname;
  })

  if (firstName.length > 0){
    return res.status(200).send(...firstName);
  } else {
    return res.status(404).send({ message: 'User not found!'});
  }
})

router.post('/', (req, res) => {
  try {
    db.userData.push(req.body);
    return res.status(201).send({message: 'User successfully created!'});
  } catch(err) {
    console.log('err', err);
    return res.status(404).send('title required');
  }
})

module.exports = router;