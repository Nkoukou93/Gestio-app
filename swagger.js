const swaggerUi = require('swagger-ui-express');
const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

const options = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'API Gestio App',
            version: '1.0.0',
            description: "Api de gestion des etudiants"
        },
        servers: [
            {
                url: 'https://gestio-app.onrender.com',
            },
        ]
    },
    
    apis: ['./app.js'],
};

const documentation = swaggerJsDoc(options);

app.use(
    "/api-doc",
    swaggerUi.setup(documentation),
    swaggerUi.serve
);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(documentation)
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
