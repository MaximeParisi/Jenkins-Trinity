const invoiceController = require('../controllers/invoiceController');
const Invoice = require('../models/Invoice');

// // Moquer le modèle Mongoose
jest.mock('../models/Invoice');

// describe('Invoice Controller', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getAllInvoices', () => {
//     it('should return all invoices', async () => {
//       const mockInvoices = [{ id: 1, totalAmount: 100 }, { id: 2, totalAmount: 200 }];
//       Invoice.find.mockResolvedValue(mockInvoices);

//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await invoiceController.getAllInvoices(req, res);

//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith(mockInvoices);
//     });

//     it('should handle errors', async () => {
//       Invoice.find.mockRejectedValue(new Error('Database error'));

//       const req = {};
//       const res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn(),
//       };

//       await invoiceController.getAllInvoices(req, res);

//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la récupération des factures.' });
//     });
//   });

//   it('should handle errors during invoice creation', async () => {
//     Invoice.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

//     const req = { body: { totalAmount: 100 } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     await invoiceController.createInvoice(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({ error: 'Erreur lors de la création de la facture.' });
//   });
// });

// describe('createInvoice', () => {
//   it('should create a new invoice', async () => {
//     Invoice.mockImplementation(() => ({
//       id: 1,
//       customer: {
//         firstName: 'John',
//         lastName: 'Doe',
//         phoneNumber: '123456789',
//         billingAddress: {
//           address: '123 Street',
//           zipCode: '12345',
//           city: 'City',
//           country: 'Country',
//         },
//       },
//       products: [
//         {
//           name: 'Product 1',
//           price: 50,
//           quantity: 2,
//         },
//       ],
//       totalAmount: 100,
//       date: new Date()
//     }));

//     const req = { body: { totalAmount: 100 } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     await invoiceController.createInvoice(req, res);

//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith({ id: 1, totalAmount: 100 });
//   });
// });

// describe('updateInvoice', () => {
//   it('should update an invoice', async () => {
//     const mockUpdatedInvoice = { id: 1, totalAmount: 150 };
//     Invoice.findByIdAndUpdate.mockResolvedValue(mockUpdatedInvoice);

//     const req = { params: { id: 1 }, body: { totalAmount: 150 } };
//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     await invoiceController.updateInvoice(req, res);

//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith(mockUpdatedInvoice);
//   });
// });

describe('deleteInvoice', () => {
  it('should delete an invoice', async () => {
    Invoice.findByIdAndDelete = jest.fn().mockResolvedValue({});

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await invoiceController.deleteInvoice(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Facture supprimée avec succès.' });
  });
});
