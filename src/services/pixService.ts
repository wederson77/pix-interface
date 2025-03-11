import axios from 'axios';

const API_URL = 'https://pix-3.onrender.com/cobranca';

export const gerarPix = async (dados: { cpf: string; nome: string; valor: string }) => {
  try {
    const response = await axios.post(API_URL, dados);
    return response.data;
  } catch (error) {
    console.error('Erro ao gerar Pix', error);
    return null;
  }
};
