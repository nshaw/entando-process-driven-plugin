export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://entando.org/schemas/poste-registration-form.json',
  type: 'object',
  properties: {
    companyInformation: {
      title: "Informazioni sull'Azienda",
      type: 'object',
      required: ['businessName', 'legalStructure', 'fiscalCode', 'vatNumber'],
      properties: {
        businessName: {
          title: 'Ragione sociale',
          type: 'string',
        },
        legalStructure: {
          title: 'Forma giuridica',
          type: 'string',
          enum: ['LTD', 'PROPRIETOR', 'LLP'],
          enumNames: [
            'Private Limited Company (Ltd)',
            'Sole Proprietor',
            'Limited Liability Partnership (LLP)',
          ],
        },
        fiscalCode: {
          title: 'Codice Fiscale',
          type: 'string',
        },
        vatNumber: {
          title: 'Partita IVA',
          type: 'string',
        },
        address: {
          title: 'Indirizzo',
          type: 'string',
        },
        postalCode: {
          title: 'CAP',
          type: 'string',
        },
        city: {
          title: 'Comune',
          type: 'string',
        },
        province: {
          title: 'Provincia',
          type: 'string',
          enum: ['FIRST_STATE', 'SECOND_STATE', 'THIRD_STATE'],
          enumNames: ['1st state', '2nd state', '3rd state'],
        },
        country: {
          title: 'Nazione',
          type: 'string',
          enum: ['IT', 'LT', 'BR', 'US', 'PH', 'OTHERS'],
          enumNames: ['Italy', 'Lithuania', 'Brazil', 'United States', 'Philippines', 'Others'],
        },
        phoneNumber: {
          title: 'Telefono (Centralino)',
          type: 'string',
        },
        website: {
          title: 'Sito Web',
          type: 'string',
        },
        sapCode: {
          title: 'SAP Code',
          type: 'string',
        },
      },
    },
  },
};
