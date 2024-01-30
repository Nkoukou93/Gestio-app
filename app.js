const express = require ('express');
const app = express ();
const port = 4000;
const bodyParser = require('body-parser');

const mysql = require("mysql")


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


//route pour recuperer les etudiants dans la base de données
app.get('/', (req, res)=>{
    res.send('Bienvenu sur Gestio: la plateforme pour gerer efficaccement vos apprenants')
})

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
        app.get("/administrateurs",(req,resp)=>{
            Administrateurs.listerAdmin((err,admins)=>{
                if (err) throw err;
                resp.status(200).json(admins);
                })
                });
    
     

app.listen(port,() =>{
    console.log(`Server is running on ${port}`);
})