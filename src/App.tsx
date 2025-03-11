import React, { useState } from 'react';
import PixForm from './components/PixForm';
import './App.css';

const App: React.FC = () => {
  const [pixData, setPixData] = useState<{ qrcode: string; imagemQrcode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePixSubmit = async (data: { cpf: string; nome: string; valor: string }) => {
    setError(null);
    setPixData(null);

    try {
      const response = await fetch('https://pix-3.onrender.com/cobranca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cpf: data.cpf,
          nome: data.nome,
          valor: data.valor, // Valor já é string
        }),
      });

      const result = await response.json();
      console.log(result);  // Verifique a resposta

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
      alert('Código Pix copiado!');
    }
  };

  return (
    <div className="app-container">
      <h4 className="title">Contribua Com A Fé</h4>
      <PixForm onSubmit={handlePixSubmit} />

      {/* Exibir erro se houver */}
      {error && <p className="error-message">{error}</p>}

      {/* Exibir QR Code e código Pix se disponível */}
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

      {/* Mensagens Persuasivas */}
      <div className="persuasive-messages">
        <p className="message">Pagamento instantâneo, sem taxas e seguro.</p>
        <p className="message">Basta escanear o QR Code ou copiar o código Pix.</p>
      </div>
    </div>
  );
};

export default App;