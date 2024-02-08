const express = require ('express');
const app = express ();
const port = 3000;
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
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


const mysql = require("mysql");


const connexion = mysql.createConnection({
    host: "mysql-guilaineyeman.alwaysdata.net",
    user: "340838",
    password: "jenaot2093@", 
    database :"guilaineyeman_gestioapp"
    
})
connexion.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données : ', err);
        process.exit(1);  // Quitter le processus en cas d'erreur
    }
    console.log('Connexion réussie à la base de données gestioapp');
});

     //Permet de parser les données envoyées par le formulaire
     app.use(bodyParser.urlencoded ({ extended: false }));


//route pour acceder à la page d'accueil
/*

 */

app.get('/', (req, res)=>{
    res.send('Bienvenu sur Gestio: la plateforme pour gerer efficaccement vos apprenants')
})
/*
* @swagger
* /etudiants:
*   get:
*     description: récupérer tous les étudiants de Gestio app
*     reponses:
*      200:
*         description: une liste d'étudiant est retournée
*         content:
*           application/json:
        500:
          description: Erreur interne du serveur


*/

app.get('/etudiants', (req, res)=>{
    connexion.query('SELECT * FROM etudiants',(erreur,data) =>{
        if (erreur) {
            console.log(erreur);
            res.status(500).send('erreur lors de la récupération des etudiants')
            
        } else {
            res.json(data).status(200);
            

            
        }
    
    });
});
//Rooute pour afficher un etudiant à artir de son id
/*
*@swagger
* /etudiants/{id}:
*   get:
*       description : Renvoi l'objet Etudiant correspondant a l'identifiant passé en paramètre
*       responses:
*          200:
*              description : Un  Etudiant est renvoyé
*          400 :
*               description :Etudiant non trouvé


*/ 
app.get("/etudiants/:id",(req,res)=> {
    let id= req.params.id;
    connexion.query(`SELECT * FROM etudiants WHERE id=?`,[id],(err,rows)=>{
        if(err){
            return res.status(400).json({ message:'etudiant non trouvé'});
            }else{
                return res.status(200).json(rows);
                }
                })
                });

    
//Route pour enregistrer les etudiants dans la base de données
/*
 * @swagger
* /etudiants:
*   post:
*   description: Ajouter un étudiant
*   responses:
*     200:
*         description: Enregistrement réussi avec succès
*     500:
*          description: Erreur lors de la création d un etudiant
 */
app.post('/etudiants',(req,res) =>{
    const {
        nom , prenom , datedenaiss , email , nomutilisateur , quartier,sexe, filiere, niveau,activitesextrasco,motdepasse,photo
    }= req.body;
connexion.query('INSERT INTO etudiants (nom , prenom , datedenaiss , email , nomutilisateur , quartier,sexe, filiere, niveau,activitesextrasco,motdepasse,photo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',[nom , prenom , datedenaiss , email , nomutilisateur , quartier,sexe, filiere, niveau,activitesextrasco,motdepasse,photo],(erreur) =>{

    if (erreur) {
        console.log(erreur);
        res.status(500).send('Erreur lors de la création d un etudiant');       
        
    } else {
        res.status(200).json({ message: 'Enregistrement réussi avec succès' });


        
    }

});
    

});
//route pour mettre à jour les etudiants de la base de données à partir de l'id sellectionné
/*
*@swagger
* /etudiants/{id}:
*   put:
*   description: Mettre à jour un étudiant par son id
*   responses:
*      200 : 
*           description : Mis à jour réussi avec succès
*      404 :  
*           description : L'identifiant n'existe pas
 */
app.put('/etudiants/:id',(req,resp)=>{
    const{id} = req.params;
    const {nom , prenom , datedenaiss , email , nomutilisateur , quartier,sexe, filiere, niveau,activitesextrasco,motdepasse,photo} = req.body
        connexion.query('UPDATE etudiants SET nom=?, prenom=?,datedenaiss=?,email=?, nomutilisateur=?, quartier=?, sexe=?,filiere=?, niveau=?, activitesextrasco=?,motdepasse=?,photo=? WHERE id=?',[nom , prenom , datedenaiss , email , nomutilisateur , quartier,sexe, filiere, niveau,activitesextrasco,motdepasse,photo,id],(erreur) =>{
            if (erreur) {
                console.log(erreur);
                resp.status(400).send("L'identifiant n'existe pas")                
            } else {
                resp.status(200).json({ message: 'Mis à jour réussi avec succès' });

            }
            })
        });
        /*
        * @swagger
        * /etudiants/:id :
        *  delete:
        *      description : Supprimer un étudiant par son id
        *      responses:
        *       200:
        *          description : Suppresion réussie avec succès'
        *       404:
        *          description : Impossible de supprimer l'etudiant
         
         */
         app.delete('/etudiants/:id',(req,resp)=> {
            const { id } = req.params;
            Etudiants.supprimerEtudiant(id,(err,resultat)=>{
                if (err){
                    resp.status(200).json({ message: `Impossible de supprimer l'etudiant ${id}` });

                    }else{
                        resp.status(200).json({ message: 'Suppresion réussie avec succès' });

                        }
                        })
                        });
        //-------------------------Gestion des administrateurs-------------------------------
        //app.get("/administrateurs",(req,resp)=>{
            //Administrateurs.listerAdmin((err,admins)=>{
                //if (err) throw err;
                //resp.status(200).json(admins);
                //})
                //});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(options));


    
     

app.listen(port,() =>{
    console.log(`Server is running on ${port}`);
})