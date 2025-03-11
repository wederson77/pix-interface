import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './PixForm.css';

interface PixFormProps {
  onSubmit: (data: { cpf: string; nome: string; valor: string }) => void;
}

// Definição do esquema de validação
const schema = yup.object().shape({
  cpf: yup.string().required('CPF é obrigatório').length(11, 'CPF inválido, digite apenas números'),
  nome: yup.string().required('Nome é obrigatório'),
  valor: yup
    .string()
    .matches(/^[0-9]+(\.[0-9]{1,3})?$/, 'Valor deve ser um número válido, com ponto e até 3 casas decimais')
    .required('Valor é obrigatório'),
});

const PixForm: React.FC<PixFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ resolver: yupResolver(schema) });
  const [valorInput, setValorInput] = useState('');

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    // Permite até 3 casas decimais
    const valorFormatado = valor.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1'); // Permite apenas 1 ponto decimal
    setValorInput(valorFormatado);
    setValue('valor', valorFormatado); // Atualiza o valor no react-hook-form
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pix-form">
      <h2 className="form-title">Pagamento via Pix</h2>
      <p className="secure-message">Pagamento 100% seguro e instantâneo!</p>
      
      <div className="form-group">
        <label>CPF:</label>
        <input {...register('cpf')} className="input-field" placeholder="Digite seu CPF" />
        <p className="error">{errors.cpf?.message}</p>
      </div>

      <div className="form-group">
        <label>Nome:</label>
        <input {...register('nome')} className="input-field" placeholder="Seu nome completo" />
        <p className="error">{errors.nome?.message}</p>
      </div>

      <div className="form-group">
        <label>Valor (R$):</label>
        <input
          type="text"
          {...register('valor')}
          value={valorInput}
          onChange={handleValorChange}
          placeholder="Ex: 15.00"
          className="input-field"
        />
        <p className="error">{errors.valor?.message}</p>
      </div>
      
      <p className="instruction">Informe os dados corretamente para gerar o código Pix.</p>
      
      <button type="submit" className="btn-submit">Gerar Pix 🚀</button>
    </form>
  );
};

export default PixForm;
