import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateQuotationPDF = (cartData, userData) => {
  return new Promise((resolve, reject) => {
    try {
      const quotationPath = path.join(__dirname, '../quotations');
      if (!fs.existsSync(quotationPath)) {
        fs.mkdirSync(quotationPath, { recursive: true });
      }

      const quotationNumber = `QT-${Date.now()}`;
      const fileName = `quotation-${quotationNumber}.pdf`;
      const filePath = path.join(quotationPath, fileName);

      const doc = new PDFDocument({ margin: 50 });

      // Pipe to file
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Company Header
      doc.fontSize(20).font('Helvetica-Bold').text('GEMINI SOLARISS', 50, 50);
      doc.fontSize(10).font('Helvetica').text('Solar Panel & Renewable Energy Solutions', 50, 75);
      doc.fontSize(9).text('No.63-A, Anna Enclave', 50, 90);
      doc.text('East Coast Road, Injambakkam', 50, 103);
      doc.text('Chennai, Tamil Nadu - 600115', 50, 116);
      doc.text('India', 50, 129);
      doc.text('Phone: +91-9876543210 | Email: admin@geminisolariss.com', 50, 142);

      // Quotation Details
      doc.fontSize(16).font('Helvetica-Bold').text('QUOTATION', 400, 50);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Quotation #: ${quotationNumber}`, 400, 80);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 400, 95);
      doc.text(`Valid Until: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 400, 110);
      doc.fontSize(9).text('(Valid for 30 days)', 400, 125);

      // Customer Details
      const customerY = 180;
      doc.fontSize(12).font('Helvetica-Bold').text('Quotation For:', 50, customerY);
      doc.fontSize(10).font('Helvetica');
      doc.text(userData.name || 'Customer', 50, customerY + 20);
      doc.text(userData.email || '', 50, customerY + 35);
      if (userData.phone) {
        doc.text(`Phone: ${userData.phone}`, 50, customerY + 50);
      }
      if (userData.address) {
        const addr = userData.address;
        if (addr.street) doc.text(addr.street, 50, customerY + 65);
        if (addr.city || addr.state) {
          doc.text(`${addr.city || ''}, ${addr.state || ''}`, 50, customerY + 80);
        }
        if (addr.zipCode) {
          doc.text(`${addr.zipCode}, ${addr.country || 'India'}`, 50, customerY + 95);
        }
      }

      // Items Table Header
      let yPos = customerY + 130;
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Item Description', 50, yPos);
      doc.text('Qty', 300, yPos);
      doc.text('Unit Price', 350, yPos);
      doc.text('Total', 450, yPos);

      // Draw line under header
      doc.moveTo(50, yPos + 15).lineTo(550, yPos + 15).stroke();

      // Items
      yPos += 25;
      doc.fontSize(9).font('Helvetica');
      const items = cartData.items || [];
      items.forEach(item => {
        const itemName = item.product?.name || item.name || 'Product';
        const quantity = item.quantity || 0;
        const price = parseFloat(item.price || 0);
        const itemTotal = price * quantity;

        // Wrap long product names
        const maxWidth = 240;
        doc.text(itemName, 50, yPos, { width: maxWidth });
        doc.text(quantity.toString(), 300, yPos);
        doc.text(`₹${price.toFixed(2)}`, 350, yPos);
        doc.text(`₹${itemTotal.toFixed(2)}`, 450, yPos);
        yPos += 25;
      });

      // Totals
      yPos += 10;
      doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
      yPos += 15;
      
      doc.fontSize(10).font('Helvetica');
      const subtotal = parseFloat(cartData.subtotal || 0);
      const discount = parseFloat(cartData.discount || 0);
      const shipping = 0; // Free shipping
      const tax = (subtotal - discount) * 0.18; // 18% GST
      const total = subtotal - discount + shipping + tax;
      
      doc.text('Subtotal:', 350, yPos);
      doc.text(`₹${subtotal.toFixed(2)}`, 450, yPos);
      
      if (discount > 0) {
        yPos += 15;
        doc.text('Discount:', 350, yPos);
        doc.text(`-₹${discount.toFixed(2)}`, 450, yPos);
      }

      if (shipping > 0) {
        yPos += 15;
        doc.text('Shipping:', 350, yPos);
        doc.text(`₹${shipping.toFixed(2)}`, 450, yPos);
      }

      yPos += 15;
      doc.text('GST (18%):', 350, yPos);
      doc.text(`₹${tax.toFixed(2)}`, 450, yPos);

      yPos += 20;
      doc.moveTo(350, yPos).lineTo(550, yPos).stroke();
      yPos += 15;
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Total Amount:', 350, yPos);
      doc.text(`₹${total.toFixed(2)}`, 450, yPos);

      // Terms and Conditions
      yPos += 40;
      doc.fontSize(10).font('Helvetica-Bold').text('Terms & Conditions:', 50, yPos);
      yPos += 15;
      doc.fontSize(9).font('Helvetica');
      doc.text('1. This quotation is valid for 30 days from the date of issue.', 50, yPos, { width: 500 });
      yPos += 15;
      doc.text('2. Prices are subject to change without prior notice.', 50, yPos, { width: 500 });
      yPos += 15;
      doc.text('3. All prices are inclusive of GST.', 50, yPos, { width: 500 });
      yPos += 15;
      doc.text('4. Payment terms: 50% advance, 50% on delivery.', 50, yPos, { width: 500 });
      yPos += 15;
      doc.text('5. Delivery time: 7-15 business days from order confirmation.', 50, yPos, { width: 500 });
      yPos += 15;
      doc.text('6. Warranty as per product specifications.', 50, yPos, { width: 500 });

      // Footer
      const pageHeight = doc.page.height;
      doc.fontSize(8).font('Helvetica').text(
        'Thank you for your interest in GEMINI SOLARISS. For any queries, contact us at admin@geminisolariss.com or +91-9876543210',
        50,
        pageHeight - 50,
        { width: 500, align: 'center' }
      );

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

