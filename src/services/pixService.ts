import axios from "axios";

export const gerarPix = async (cpf: string, nome: string, valor: string) => {
  try {
    // Garantir que o CPF esteja limpo (somente números)
    const cpfFormatado = cpf.replace(/\D/g, "");

    // Garantir que o valor esteja no formato correto (duas casas decimais)
    const valorFormatado = parseFloat(valor).toFixed(2);

    const payload = {
      cpf: cpfFormatado,
      nome: nome.trim(),
      valor: valorFormatado
    };

    const response = await axios.post("http://localhost:3001/pix", payload, {
      headers: { "Content-Type": "application/json" }
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao gerar PIX:", error);
    return null;
  }
};
