// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import axios from 'axios';

// // Web3 setup (Ensure you have already configured connection.js)
// import { contract } from './connection';

// // Utility to display PDF in the browser using an iframe
// export function displayPDF(file) {
//     const fileReader = new FileReader();
//     fileReader.onload = function (event) {
//         const base64 = event.target.result.split(',')[1];
//         const iframe = document.createElement('iframe');
//         iframe.src = `data:application/pdf;base64,${base64}`;
//         iframe.width = '700';
//         iframe.height = '1000';
//         document.body.appendChild(iframe);
//     };
//     fileReader.readAsDataURL(file);
// }

// // Function to view certificate by ID (Fetch from IPFS via Smart Contract)
// export async function viewCertificate(certificateId) {
//     try {
//         // Call the smart contract to get the certificate details
//         const result = await contract.methods.getCertificate(certificateId).call();
//         const ipfsHash = result[4];

//         // Pinata gateway base URL
//         const pinataGatewayBaseUrl = 'https://gateway.pinata.cloud/ipfs';
//         const contentUrl = `${pinataGatewayBaseUrl}/${ipfsHash}`;

//         // Fetch PDF from IPFS
//         const response = await axios.get(contentUrl, { responseType: 'blob' });

//         // Display the PDF
//         const file = new Blob([response.data], { type: 'application/pdf' });
//         displayPDF(file);
//     } catch (error) {
//         console.error("Error viewing certificate: ", error);
//     }
// }

// // Hide icons in the UI (Optional depending on your app's layout)
// export function hideIcons() {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         #MainMenu {visibility: hidden;}
//         footer {visibility: hidden;}
//     `;
//     document.head.appendChild(style);
// }

// // Hide the sidebar (Optional based on your UI)
// export function hideSidebar() {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         div[data-testid="stSidebarNav"] {visibility: hidden;}
//     `;
//     document.head.appendChild(style);
// }

// // Remove unnecessary white spaces in the layout
// export function removeWhitespaces() {
//     const style = document.createElement('style');
//     style.innerHTML = `
//         .css-18e3th9 {
//             padding-top: 0rem;
//             padding-bottom: 10rem;
//             padding-left: 5rem;
//             padding-right: 5rem;
//         }
//         .css-1d391kg {
//             padding-top: 3.5rem;
//             padding-right: 1rem;
//             padding-bottom: 3.5rem;
//             padding-left: 1rem;
//         }
//     `;
//     document.head.appendChild(style);
// }

// // Function to generate a certificate PDF in the browser

// export async function generatePDF(formData) {
//     const pdfDoc = await PDFDocument.create();
//     const page = pdfDoc.addPage([600, 800]);
//     const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
//     page.drawText(formData.org, {
//       x: 200,
//       y: 730,
//       size: 15,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
  
//     page.drawText('Certificate of Completion', {
//       x: 200,
//       y: 700,
//       size: 25,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
  
//     page.drawText(`This is to certify that ${formData.name} has completed the course: ${formData.course}`, {
//       x: 100,
//       y: 650,
//       size: 14,
//       font: timesRomanFont,
//       color: rgb(0, 0, 0),
//     });
  
//     const pdfBytes = await pdfDoc.save();
//     const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
//     const pdfUrl = URL.createObjectURL(pdfBlob); // Create URL for download
  
//     return { pdfBlob, pdfUrl };
//   }
// // Function to extract certificate details from a PDF in the browser (simplified)
// export async function extractCertificate(file) {
//     try {
//         const fileReader = new FileReader();
//         return new Promise((resolve, reject) => {
//             fileReader.onload = async function(event) {
//                 const pdfBytes = new Uint8Array(event.target.result);
//                 const pdfDoc = await PDFDocument.load(pdfBytes);

//                 // Extract text from the PDF (assuming it's a simple text-based certificate)
//                 let text = '';
//                 const pages = pdfDoc.getPages();
//                 for (const page of pages) {
//                     const { textContent } = await page.getTextContent();
//                     text += textContent;
//                 }

//                 const lines = text.split('\n');
//                 const orgName = lines[0];
//                 const candidateName = lines[3];
//                 const courseName = lines[lines.length - 1];

//                 resolve({ candidateName, courseName, orgName });
//             };

//             fileReader.onerror = (error) => {
//                 reject(error);
//             };

//             fileReader.readAsArrayBuffer(file);
//         });
//     } catch (error) {
//         console.error("Error extracting certificate details: ", error);
//     }
// }

// import axios from 'axios';

// export async function uploadToIPFS(pdfBlob, uid) {
//   const formData = new FormData();
//   formData.append('file', pdfBlob, `certificate-${uid}.pdf`);

//   const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       'pinata_api_key': '<YOUR_API_KEY>',
//       'pinata_secret_api_key': '<YOUR_SECRET_API_KEY>',
//     },
//   });

//   return res.data.IpfsHash; // Return IPFS hash
// }
