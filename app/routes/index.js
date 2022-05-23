var express = require('express');
var router = express.Router();
const data = require('../userData');
const methods = require('../methods');
const save = require('../registro');

//rutas
const registerRoute = "../views/pages/register";
const loginRoute = "../views/pages/login";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Programación Computacional IV' });
});

router.get('/home', (req, res, next) => {
  res.render('home', {title: "Bienvenido"});
});

router.get('/register', (req, res) => {
  res.render(registerRoute);
});

router.get('/login', (req, res) => {
  res.render(loginRoute);
});

router.post('/register', (req, res) => {
  
  const { email, fullName, password, confirmPassword } = req.body;

  //verificar si el password coincide
  if (password === confirmPassword) {
    //verificar si el correo esta registrado
    if (data.data.find(dat => dat.email === email)) {
      res.render(registerRoute, {
        message: "El usuario ya esta registrado",
        messageClass: "alert-danger"
      }); 
    }
    const hashedPassword = methods.getHashedPassword(password);

    //actualiza el array con el nuevo registro
    data.data.push ({
      fullName: fullName,
      email: email,
      password: hashedPassword
    });
    save.save(
      "{fullName:'"+fullName+"',email:'"+email+"',password:'"+hashedPassword+"'}, "
    )
    res.render(loginRoute, {
          message: "El registro se ha compleado",
          messageClass: "alert-success"
    });

  } else {
    res.render(registerRoute, {
      message: "El password no coincide",
      messageClass: "alert-danger"
    });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = methods.getHashedPassword(password);

  const dataUser = data.data.find(u => {
    return u.email === email && hashedPassword === u.password;
  });

  if(dataUser){
    const authToken = methods.generateAuthToken();

    //almacenar el token de autenticacion
    methods.authTokens[authToken] = dataUser;
    res.cookie('AuthToken', authToken);
    res.redirect("/home");
  } else {
    res.render(loginRoute, {
      message: "Usuario y password invalidos",
      messageClass: "alert-danger"
    });
  }
});

module.exports = router;
