"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfGenerator = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const dbConnection_1 = require("./dbconfig/dbConnection");
function pdfGenerator(data, res) {
    const pdf = new pdfkit_1.default(); // Create a new instance of PDFDocument
    try {
        const { type, firstName, lastName, address, country, town, zip, product, price, quantity, tva } = data;
        console.log(data.address);
        pdf.pipe(res);
        pdf.text(`Invoice of ${lastName} for the ${product}`);
        pdf.text(`Type: ${type}`);
        pdf.text(`First Name: ${firstName}`);
        pdf.text(`Last Name: ${lastName}`);
        pdf.text(`Address: ${address}`);
        pdf.text(`Country: ${country}`);
        pdf.text(`Town: ${town}`);
        pdf.text(`ZIP: ${zip}`);
        pdf.text('Product Information:', { underline: true });
        pdf.text(`Product: ${product}`);
        pdf.text(`Price: ${price}`);
        pdf.text(`Quantity: ${quantity}`);
        pdf.text(`TVA: ${tva}%`);
        pdf.end();
        // fileContentCheck permet de recup les données en morceaux pour les tranfomer
        // en binaire pour pouvoir les reassemblé plus tard avec buffer.concat
        const fileContentChunks = [];
        pdf.on('data', (chunk) => {
            fileContentChunks.push(chunk);
        });
        pdf.on('end', () => {
            const fileContent = Buffer.concat(fileContentChunks);
            const query = 'INSERT INTO pdf_files (file_name, file_content) VALUES (?, ?)';
            dbConnection_1.connection.query(query, [`${lastName}_${product}_${type}.pdf`, fileContent], (error) => {
                if (error) {
                    console.error("Erreur lors de l'enregistrement du PDF dans la base de données :", error);
                    res.status(500).send("Erreur lors de la génération du PDF");
                }
            });
        });
    }
    catch (e) {
        console.log(e);
        console.log(data);
        res.status(500).send("Erreur lors de la generation du pdf");
    }
}
exports.pdfGenerator = pdfGenerator;
