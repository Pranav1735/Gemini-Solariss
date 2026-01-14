import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const invoicePath = path.join(__dirname, '../invoices');
      if (!fs.existsSync(invoicePath)) {
        fs.mkdirSync(invoicePath, { recursive: true });
      }

      const fileName = `invoice-${order.orderNumber}.pdf`;
      const filePath = path.join(invoicePath, fileName);

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

      // Invoice Details
      doc.fontSize(16).font('Helvetica-Bold').text('INVOICE', 400, 50);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Invoice #: ${order.orderNumber}`, 400, 80);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95);
      doc.text(`Status: ${order.status.toUpperCase()}`, 400, 110);

      // Customer Details
      const customerY = 180;
      doc.fontSize(12).font('Helvetica-Bold').text('Bill To:', 50, customerY);
      doc.fontSize(10).font('Helvetica');
      const address = order.shippingAddress || {};
      doc.text(address.name || 'Customer', 50, customerY + 20);
      doc.text(address.street || '', 50, customerY + 35);
      doc.text(`${address.city || ''}, ${address.state || ''}`, 50, customerY + 50);
      doc.text(`${address.zipCode || ''}, ${address.country || ''}`, 50, customerY + 65);
      doc.text(`Phone: ${address.phone || ''}`, 50, customerY + 80);

    // Items Table Header
    let yPos = customerY + 120;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Item', 50, yPos);
    doc.text('Quantity', 250, yPos);
    doc.text('Price', 350, yPos);
    doc.text('Total', 450, yPos);

    // Items
    yPos += 20;
    doc.fontSize(9).font('Helvetica');
    const items = order.items || [];
    items.forEach(item => {
      const itemName = item.name || (item.product?.name || 'Product');
      const quantity = item.quantity || 0;
      const price = parseFloat(item.price || 0);
      doc.text(itemName.substring(0, 30), 50, yPos);
      doc.text(quantity.toString(), 250, yPos);
      doc.text(`₹${price.toFixed(2)}`, 350, yPos);
      doc.text(`₹${(price * quantity).toFixed(2)}`, 450, yPos);
      yPos += 20;
    });

    // Totals
    yPos += 10;
    doc.fontSize(10).font('Helvetica');
    const subtotal = parseFloat(order.subtotal || 0);
    const discount = parseFloat(order.discount || 0);
    const shipping = parseFloat(order.shipping || 0);
    const tax = parseFloat(order.tax || 0);
    const total = parseFloat(order.total || 0);
    
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

    if (tax > 0) {
      yPos += 15;
      doc.text('Tax:', 350, yPos);
      doc.text(`₹${tax.toFixed(2)}`, 450, yPos);
    }

    yPos += 15;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('Total:', 350, yPos);
    doc.text(`₹${total.toFixed(2)}`, 450, yPos);

      // Payment Info
      yPos += 40;
      doc.fontSize(10).font('Helvetica');
      doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 50, yPos);
      doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`, 50, yPos + 15);

      // Footer
      const footerY = 750;
      doc.fontSize(8).font('Helvetica').text('Thank you for choosing GEMINI SOLARISS!', 50, footerY);
      doc.text('For inquiries, please contact us at admin@geminisolariss.com', 50, footerY + 15);

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

