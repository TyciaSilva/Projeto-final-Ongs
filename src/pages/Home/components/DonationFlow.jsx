import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DonationFlow = () => {
  const [step, setStep] = useState('amount');
  const [amount, setAmount] = useState(10);
  const [showMethodPopup, setShowMethodPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('form');

  const handleAmountSelection = (selectedAmount) => {
    setAmount(selectedAmount);
  };

  const handleCustomAmount = (e) => {
    const value = Math.max(10, Number(e.target.value) || 10);
    setAmount(value);
  };

  const openMethodPopup = () => {
    setShowMethodPopup(true);
  };

  const closeMethodPopup = () => {
    setShowMethodPopup(false);
  };

  const simulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('approved');
      setTimeout(() => {
        setStep('amount');
        setPaymentStatus('form');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="donation-container">
      <div className="donation-header">
        <h2>DOE E AJUDE A MANTER ESTA PLATAFORMA</h2>
        <p>Sua doação não vai para uma ONG específica, mas sim para manter este site no ar e disponível para todas as organizações cadastradas.</p>
      </div>

      {step === 'amount' && (
        <div className="amount-selection">
          <div className="amount-grid">
            {[35, 80, 100, 150].map((value) => (
              <button
                key={value}
                className={`amount-option ${amount === value ? 'selected' : ''}`}
                onClick={() => handleAmountSelection(value)}
              >
                R$ {value.toFixed(2)}
              </button>
            ))}
          </div>

          <div className="custom-amount">
            <div className="input-group">
              <span>R$</span>
              <input
                type="number"
                min="10"
                value={amount}
                onChange={handleCustomAmount}
                placeholder="Outro valor"
              />
            </div>
            <p className="amount-note">Valor mínimo: R$ 10,00</p>
          </div>

          <button className="continue-btn" onClick={openMethodPopup}>
            Continuar
          </button>
        </div>
      )}

      {step === 'pix' && (
        <PixPayment 
          amount={amount} 
          onBack={() => setStep('amount')} 
          paymentStatus={paymentStatus}
          simulatePayment={simulatePayment}
        />
      )}

      {step === 'card' && (
        <CardPayment 
          amount={amount} 
          onBack={() => setStep('amount')} 
          paymentStatus={paymentStatus}
          simulatePayment={simulatePayment}
        />
      )}

      {/* Popup para seleção de método de pagamento */}
      <AnimatePresence>
        {showMethodPopup && (
          <div className="popup-overlay" onClick={closeMethodPopup}>
            <motion.div 
              className="method-popup"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button className="close-popup" onClick={closeMethodPopup}>×</button>
              <h3>Selecione o método de pagamento</h3>
              <div className="selected-amount">
                <span>Valor:</span>
                <strong>R$ {amount.toFixed(2)}</strong>
              </div>
              
              <div className="method-options">
                <button 
                  className="method-option"
                  onClick={() => {
                    setStep('pix');
                    closeMethodPopup();
                  }}
                >
                  <div className="method-icon">PIX</div>
                  <div className="method-info">
                    <h4>Pagamento instantâneo</h4>
                    <p>Processamento imediato</p>
                  </div>
                </button>
                
                <button 
                  className="method-option"
                  onClick={() => {
                    setStep('card');
                    closeMethodPopup();
                  }}
                >
                  <div className="method-icon">💳</div>
                  <div className="method-info">
                    <h4>Cartão de Crédito</h4>
                    <p>Visa, Mastercard, etc</p>
                  </div>
                </button>
              </div>
              
              <div className="sandbox-notice">
                <p>🔒 Você está no modo sandbox - Todos os pagamentos são simulações</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de Pagamento PIX
const PixPayment = ({ amount, onBack, paymentStatus, simulatePayment }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText('merchantx@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pix-payment">
      <button className="back-button" onClick={onBack}>
        ← Voltar
      </button>
      
      <h3>PAGAMENTO VIA PIX (MODO TESTE)</h3>
      
      {paymentStatus === 'form' && (
        <div className="pix-content">
          <div className="qr-code-container">
            <div className="qr-placeholder">
              <div className="qr-pattern"></div>
              <div className="qr-logo">PIX</div>
            </div>
            <p className="amount">R$ {amount.toFixed(2)}</p>
          </div>
          
          <div className="pix-info">
            <p>Chave PIX:</p>
            <div className="pix-key" onClick={copyToClipboard}>
              merchantx@example.com
              <span>{copied ? '✓ Copiado!' : 'Clique para copiar'}</span>
            </div>
          </div>
          
          <button className="simulate-btn" onClick={simulatePayment}>
            Simular Pagamento
          </button>
        </div>
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
          <h4>Pagamento Aprovado!</h4>
          <p>Obrigado por testar nossa plataforma</p>
          <div className="transaction-details">
            <p>Valor: <strong>R$ {amount.toFixed(2)}</strong></p>
            <p>Método: <strong>PIX</strong></p>
          </div>
        </div>
      )}

      <div className="sandbox-notice">
        <p>🔒 AMBIENTE DE TESTE - Nenhum valor real será transferido</p>
      </div>
    </div>
  );
};

// Componente de Pagamento com Cartão
const CardPayment = ({ amount, onBack, paymentStatus, simulatePayment }) => {
  const [cardData, setCardData] = useState({
    number: '4111 1111 1111 1111',
    name: 'Nome Completo',
    expiry: '12/30',
    cvv: '123'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card-payment">
      <button className="back-button" onClick={onBack}>
        ← Voltar
      </button>
      
      <h3>PAGAMENTO COM CARTÃO (MODO TESTE)</h3>
      
      {paymentStatus === 'form' && (
        <form className="card-form" onSubmit={(e) => {
          e.preventDefault();
          simulatePayment();
        }}>
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
            <div className="form-group">
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
            
            <div className="form-group">
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
          
          <div className="amount-display">
            <span>Valor:</span>
            <strong>R$ {amount.toFixed(2)}</strong>
          </div>
          
          <button type="submit" className="submit-btn">
            Simular Pagamento
          </button>
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
          <h4>Pagamento Aprovado!</h4>
          <p>Obrigado por testar nossa plataforma</p>
          <div className="transaction-details">
            <p>Valor: <strong>R$ {amount.toFixed(2)}</strong></p>
            <p>Cartão: **** **** **** {cardData.number.slice(-4)}</p>
          </div>
        </div>
      )}

      <div className="test-cards">
        <h4>Cartões de Teste:</h4>
        <ul>
          <li><span className="card-brand visa">Visa</span> 4111 1111 1111 1111</li>
          <li><span className="card-brand mastercard">Mastercard</span> 5555 5555 5555 4444</li>
          <li><span className="card-brand amex">Amex</span> 3782 822463 10005</li>
        </ul>
      </div>

      <div className="sandbox-notice">
        <p>🔒 AMBIENTE DE TESTE - Nenhum valor real será cobrado</p>
      </div>
    </div>
  );
};

export default DonationFlow;