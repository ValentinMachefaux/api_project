import express from 'express';
import bodyParser from 'body-parser';
import { pdfGenerator } from './pdfGenerator';
import {connection} from "./dbconfig/dbConnection";


const app = express();
const port = 2901;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/pdfGen', (req, res) => {

    // console.log(req)
    // console.log(res)
    const { type, firstName, lastName, address, country, town, zip, product, price, quantity, tva } = req.body;

    res.setHeader('Content-Disposition', `attachment; filename="${lastName}_${product}_invoice.pdf"`);
    pdfGenerator({ type, firstName, lastName, address, country, town, zip, product, price, quantity, tva }, res)

});

app.get('/invoices', (req, res) =>{

    connection.query(
        "SELECT `id`,`file_name` FROM `pdf_files` WHERE `file_name` LIKE '%invoice%';",
        (error, result)=>{
            if (error){

                console.error("Erreur lors de la recuperation du devis:", error)
                res.status(500).json({ error: 'Erreur lors de la recuperation du devis' });

            }else {

                res.json(result)

            }
        }
    )
})

app.get('/estimates', (req, res) =>{

    connection.query(
        "SELECT `id`,`file_name` FROM `pdf_files` WHERE `file_name` LIKE '%estimate%';",
        (error, result)=>{
            if (error){
                console.error("Erreur lors de la recuperation du devis:", error)
            }else {
                res.json(result)
            }
        }
    )
})

app.delete('/invoices/:id', (req, res) => {

    const invoiceId = req.params.id;

    connection.query(
        'DELETE FROM `pdf_files` WHERE id = ?',
        [invoiceId],
        (error, results) => {
        if (error) {

            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });

        } else {

            res.json({ message: 'Facture supprimée avec succès' });

        }
    });
});

app.delete('/estimates/:id', (req, res) => {

    const estimateId = req.params.id;

    connection.query(
        'DELETE FROM `pdf_files` WHERE id = ?',
        [estimateId],
        (error, results) => {
        if (error) {

            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });

        } else {

            res.json({ message: 'Facture supprimée avec succès' });

        }
    });
});


app.listen(port, () => {
    console.log(`serv lancer au port:${port}`);
});


/* TODO :
    Partie 1:
    TERMINER - Mettre en place une API en utilisant Node.js et Express qui permet de générer des documents PDF.
    TERMINER - Le type de document PDF est au choix de l'étudiant (exemples : facture, devis, CV). Soyez créatifs !
    TERMINER- Développer une interface web simple qui interagit avec cette API pour permettre aux utilisateurs de sélectionner le type de document à générer et de visualiser le PDF résultant
    Partie 2:
    Terminer - Améliorer l'application en intégrant une base de données SQL pour stocker les informations relatives aux PDF générés.
    Terminer - L'interface web doit maintenant permettre aux utilisateurs de consulter l'historique de leurs documents PDF générés.
    Semi terminer (pas d'affichage) - Les utilisateurs devraient être en mesure de consulter,  et supprimer les entrées historiques.
 */