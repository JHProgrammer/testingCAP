const cds = require('@sap/cds');

const cors = require('cors');


const xsenv = require('@sap/xsenv')


const { XssecPassportStrategy, XsuaaService } = require('@sap/xssec')


const passport = require('passport');

const app = require('@sap/cds/app');

cds.on('bootstrap', async (app) => {

    /* 

    Configuramos el XSUAA como authentication

    */

    xsenv.loadEnv();

    const service = xsenv.getServices({

        xsuaa: 'xsuaa-central'

    }).xsuaa;

    const auhtService = new XsuaaService(service);

    passport.use(new XssecPassportStrategy(auhtService));




    //Configuramos el backend con el passport configurado

    app.use(passport.initialize())

    app.use(passport.authenticate('JWT', { session: false }));


    app.get('/jwt', async (req, res) => {

        console.log("req.headers?.authorization", req.headers?.authorization ?? 'No existe');

        res.send({

            status: 200,

            data: {

                jwt: req.headers?.authorization ?? ''

            }

        })

    })
    app.use(cors());
});


module.exports = cds.server;