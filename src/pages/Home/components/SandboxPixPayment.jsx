import React, { useState, useEffect } from 'react';

const SandboxPixPayment = ({ amount }) => {
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');

  // Gera dados fictícios para o Pix
  useEffect(() => {
    const generateMockPixData = () => {
      const randomId = Math.floor(Math.random() * 1000000000000);
      return {
        qrCode: `00020101021226580014br.gov.bcb.pix0136${randomId}52040000530398654${amount.toFixed(2)}5802BR5915CONECTA ONGS6009SAO PAULO62070503***6304`,
        pixKey: `conectaongs+teste${randomId}@sandbox.com`,
        transactionId: `MP${Date.now()}`
      };
    };

    const pixData = generateMockPixData();
    setQrCode(pixData.qrCode);
  }, [amount]);

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setPaymentStatus('processing');
    
    // Simula o tempo de processamento
    setTimeout(() => {
      setPaymentStatus('approved');
    }, 3000);
  };

  return (
    <div className="pix-payment sandbox">
      <h2>PAGAMENTO VIA PIX (MODO TESTE)</h2>
      
      {paymentStatus === 'pending' && (
        <>
          <div className="qr-code-container">
            <div className="mock-qr-code">
              <div className="qr-placeholder" />
              <p>Valor: R$ {amount.toFixed(2)}</p>
            </div>
          </div>

          <div className="pix-info">
            <p>Chave Pix:</p>
            <div className="pix-key" onClick={handleCopyPixKey}>
              {qrCode.substring(0, 30)}...
              <span>{copied ? '✓ Copiado!' : 'Clique para copiar'}</span>
            </div>
          </div>

          <button 
            className="simulate-btn"
            onClick={simulatePayment}
          >
            Simular Pagamento
          </button>
        </>
      )}

      {paymentStatus === 'processing' && (
        <div className="processing">
          <div className="loader"></div>
          <p>Processando pagamento...</p>
        </div>
      )}

      {paymentStatus === 'approved' && (
        <div className="success">
          <div className="icon">✓</div>
          <h3>Pagamento Aprovado!</h3>
          <p>Obrigado por testar nossa plataforma</p>
          <p>ID da Transação: {qrCode.substring(50, 70)}</p>
        </div>
      )}

      <div className="sandbox-notice">
        <p>🔒 AMBIENTE DE TESTE - Nenhum valor real será transferido</p>
      </div>
    </div>
  );
};

export default SandboxPixPayment;