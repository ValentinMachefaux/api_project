"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const pdfGenerator_1 = require("./pdfGenerator");
const dbConnection_1 = require("./dbconfig/dbConnection");
const app = (0, express_1.default)();
const port = 2901;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
app.post('/pdfGen', (req, res) => {
    // console.log(req)
    // console.log(res)
    const { type, firstName, lastName, address, country, town, zip, product, price, quantity, tva } = req.body;
    res.setHeader('Content-Disposition', `attachment; filename="${lastName}_${product}_invoice.pdf"`);
    (0, pdfGenerator_1.pdfGenerator)({ type, firstName, lastName, address, country, town, zip, product, price, quantity, tva }, res);
});
app.get('/invoices', (req, res) => {
    dbConnection_1.connection.query("SELECT `id`,`file_name` FROM `pdf_files` WHERE `file_name` LIKE '%invoice%';", (error, result) => {
        if (error) {
            console.error("Erreur lors de la recuperation du devis:", error);
            res.status(500).json({ error: 'Erreur lors de la recuperation du devis' });
        }
        else {
            res.json(result);
        }
    });
});
app.get('/estimates', (req, res) => {
    dbConnection_1.connection.query("SELECT `id`,`file_name` FROM `pdf_files` WHERE `file_name` LIKE '%estimate%';", (error, result) => {
        if (error) {
            console.error("Erreur lors de la recuperation du devis:", error);
        }
        else {
            res.json(result);
        }
    });
});
app.delete('/invoices/:id', (req, res) => {
    const invoiceId = req.params.id;
    dbConnection_1.connection.query('DELETE FROM `pdf_files` WHERE id = ?', [invoiceId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
        }
        else {
            res.json({ message: 'Facture supprimée avec succès' });
        }
    });
});
app.delete('/estimates/:id', (req, res) => {
    const estimateId = req.params.id;
    dbConnection_1.connection.query('DELETE FROM `pdf_files` WHERE id = ?', [estimateId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la facture' });
        }
        else {
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
