// src/components/SandboxCardPayment.jsx
import React, { useState } from 'react';

const SandboxCardPayment = ({ amount, onBack }) => {
  const [cardData, setCardData] = useState({
    number: '4111 1111 1111 1111',
    name: 'Nome Completo',
    expiry: '12/30',
    cvv: '123'
  });
  const [paymentStatus, setPaymentStatus] = useState('form');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    setTimeout(() => {
      setPaymentStatus('approved');
    }, 3000);
  };

  const resetForm = () => {
    setPaymentStatus('form');
  };

  return (
    <div className="card-payment sandbox">
      <button onClick={onBack} className="back-button">← Voltar</button>
      <h2>PAGAMENTO COM CARTÃO (MODO TESTE)</h2>
      
      {paymentStatus === 'form' && (
        <form onSubmit={handleSubmit} className="card-form">
          <div className="form-group">
            <label>Número do Cartão</label>
            <input
              type="text"
              name="number"
              value={cardData.number}
              onChange={handleChange}
              placeholder="4111 1111 1111 1111"
              maxLength="19"
              className="card-input"
            />
          </div>
          
          <div className="form-group">
            <label>Nome no Cartão</label>
            <input
              type="text"
              name="name"
              value={cardData.name}
              onChange={handleChange}
              placeholder="Nome Completo"
              className="card-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half-width">
              <label>Validade (MM/AA)</label>
              <input
                type="text"
                name="expiry"
                value={cardData.expiry}
                onChange={handleChange}
                placeholder="12/30"
                maxLength="5"
                className="card-input"
              />
            </div>
            
            <div className="form-group half-width">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={cardData.cvv}
                onChange={handleChange}
                placeholder="123"
                maxLength="3"
                className="card-input"
              />
            </div>
          </div>
          
          <div className="amount-info">
            <p>Valor: <strong>R$ {amount.toFixed(2)}</strong></p>
          </div>
          
          <button type="submit" className="submit-btn">Simular Pagamento</button>
          
          <div className="test-cards">
            <h4>Cartões de Teste:</h4>
            <ul>
              <li><span className="card-type mastercard"></span> Mastercard: <strong>5555 5555 5555 4444</strong></li>
              <li><span className="card-type visa"></span> Visa: <strong>4111 1111 1111 1111</strong></li>
              <li><span className="card-type amex"></span> American Express: <strong>3782 822463 10005</strong></li>
            </ul>
          </div>
        </form>
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
          <div className="transaction-details">
            <p>Valor: <strong>R$ {amount.toFixed(2)}</strong></p>
            <p>Cartão: **** **** **** {cardData.number.slice(-4)}</p>
          </div>
          <button onClick={resetForm} className="new-payment-btn">
            Nova Simulação
          </button>
        </div>
      )}

      <div className="sandbox-notice">
        <p>🔒 AMBIENTE DE TESTE - Nenhum valor real será cobrado</p>
      </div>
    </div>
  );
};

export default SandboxCardPayment;