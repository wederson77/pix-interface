import React, { useState } from 'react';
import PixForm from './components/PixForm';
import './App.css';

const Modal: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose} className="btn-close">Fechar</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [pixData, setPixData] = useState<{ qrcode: string; imagemQrcode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePixSubmit = async (data: { cpf: string; nome: string; valor: string }) => {
    setError(null);
    setPixData(null);

    try {
      const response = await fetch('https://pix-3.onrender.com/cobranca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.sucesso) {
        setPixData({
          qrcode: result.dados.qrCode.qrcode,
          imagemQrcode: result.dados.qrCode.imagemQrcode,
        });
      } else {
        setError(result.mensagem || 'Erro ao gerar QR Code.');
      }
    } catch (err) {
      setError('Erro na conexão com a API.');
    }
  };

  const copiarCodigoPix = () => {
    if (pixData?.qrcode) {
      navigator.clipboard.writeText(pixData.qrcode);
      setShowModal(true);
    }
  };

  return (
    <div className="app-container">
      <h4 className="title">Contribua Com A Fé</h4>
      <PixForm onSubmit={handlePixSubmit} />

      {error && <p className="error-message">{error}</p>}

      {pixData && (
        <div className="pix-result">
          <h3>QR Code Gerado:</h3>
          {pixData.imagemQrcode ? (
            <img src={pixData.imagemQrcode} alt="QR Code" className="qrcode-img" />
          ) : (
            <p>Erro ao carregar o QR Code.</p>
          )}
          <h4>Código Pix:</h4>
          <p className="pix-code">{pixData.qrcode}</p>
          <button onClick={copiarCodigoPix} className="btn-copy">Copiar Código Pix</button>
          <br />
          <a href={pixData.qrcode} target="_blank" rel="noopener noreferrer" className="btn-visualizar">
            Visualizar Pagamento
          </a>
        </div>
      )}

      <div className="persuasive-messages">
        <p className="message">Pagamento instantâneo, sem taxas e seguro.</p>
        <p className="message">Basta escanear o QR Code ou copiar o código Pix.</p>
      </div>

      {showModal && <Modal message="Código Pix copiado!" onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default App;