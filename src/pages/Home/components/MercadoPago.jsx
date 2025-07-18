import { MercadoPagoConfig } from '@mercadopago/sdk-react';

// Configuração para ambiente de testes
MercadoPagoConfig.configure({
  publicKey: 'TEST-XXXXXXXXXXXXXXXX', // Chave pública de teste
  locale: 'pt-BR',
  advanced: {
    autoClose: true,
    theme: {
      elementsColor: '#4CAF50',
      headerColor: '#4CAF50'
    }
  }
});