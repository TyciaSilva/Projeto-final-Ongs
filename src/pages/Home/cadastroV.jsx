// src/pages/Home/cadastroV.jsx
import "./style.css";
import { useState } from "react";
import { mascaraCPF, mascaraCelular, mascaraCEP } from "../../utils/mascaras";
function cadastroV() {
  const [form, setForm] = useState({
    nome: '',
    data: '',
    cpf: '',
    celular: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    logradouro: '',
    complemento: '',
    gmail: '',
    sexo: '',
  });

  const estados = {
    AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
    CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
    MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
    PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
    RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
    RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
    SE: 'Sergipe', TO: 'Tocantins'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let maskedValue = value;

    if (name === 'cpf') maskedValue = mascaraCPF(value);
    if (name === 'celular') maskedValue = mascaraCelular(value);
    if (name === 'cep') maskedValue = mascaraCEP(value);

    setForm((prev) => ({ ...prev, [name]: maskedValue }));
  };

  const buscarCEP = async () => {
    const cep = form.cep.replace(/\D/g, '');
    if (cep.trim() === '') {
      limparCampos();
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) {
        limparCampos();
        setForm((prev) => ({
          ...prev,
          bairro: 'Bairro Não Encontrado',
          cidade: 'Cidade Não Encontrada',
          estado: 'Estado Não Encontrado',
          logradouro: 'Logradouro Não Encontrado',
        }));
      } else {
        const ufCompleto = estados[data.uf] || data.uf;
        setForm((prev) => ({
          ...prev,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: ufCompleto,
          logradouro: data.logradouro,
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      limparCampos();
    }
  };

  const limparCampos = () => {
    setForm((prev) => ({
      ...prev,
      bairro: '',
      cidade: '',
      estado: '',
      logradouro: '',
    }));
  };

  return (
    <div className="cadastro-body">
      <div className="container">
        <div className="form-image">
          <img src="imagens/Imagem_central.png" alt="Imagem central" />
        </div>

        <div className="form">
          <form action="Funcoes.php" method="post">
            <div className="form-header">
              <div className="title">
                <h1>Cadastro de Voluntário</h1>
              </div>
            </div>

            <div className="input-group">
              <div className="input-box">
                <label htmlFor="nome">Nome Completo</label>
                <input type="text" name="nome" placeholder="Digite seu nome completo" required value={form.nome} onChange={handleChange} />
              </div>

              <div className="input-box">
                <label htmlFor="data">Data de Nascimento</label>
                <input type="date" name="data" required value={form.data} onChange={handleChange} />
              </div>

              <div className="input-box">
                <label htmlFor="cpf">CPF</label>
                <input type="text" name="cpf" maxLength="14" placeholder="000.000.000-00" required value={form.cpf} onChange={handleChange} />
              </div>

              <div className="input-box">
                <label htmlFor="celular">Celular</label>
                <input type="text" name="celular" maxLength="15" placeholder="(00) 00000-0000" required value={form.celular} onChange={handleChange} />
              </div>

              <div className="input-box">
                <label htmlFor="cep">CEP</label>
                <input type="text" name="cep" maxLength="9" placeholder="00000-000" required value={form.cep} onChange={handleChange} onBlur={buscarCEP} />
              </div>

              <div className="input-box">
                <label htmlFor="estado">Estado</label>
                <input type="text" name="estado" readOnly required value={form.estado} />
              </div>

              <div className="input-box">
                <label htmlFor="cidade">Cidade</label>
                <input type="text" name="cidade" readOnly required value={form.cidade} />
              </div>

              <div className="input-box">
                <label htmlFor="bairro">Bairro</label>
                <input type="text" name="bairro" readOnly required value={form.bairro} />
              </div>

              <div className="input-box">
                <label htmlFor="logradouro">Logradouro</label>
                <input type="text" name="logradouro" readOnly required value={form.logradouro} />
              </div>

              <div className="input-box">
                <label htmlFor="complemento">Número</label>
                <input type="text" name="complemento" placeholder="Número da residência" value={form.complemento} onChange={handleChange} />
              </div>

              <div className="input-box">
                <label htmlFor="gmail">Gmail</label>
                <input type="email" name="gmail" placeholder="exemplo@gmail.com" required value={form.gmail} onChange={handleChange} />
              </div>
            </div>

            <div className="gender-inputs">
              <div className="gender-title">
                <h6>Sexo</h6>
              </div>
              <div className="gender-group">
                {['Masculino', 'Feminino', 'Neutro ou Não informado'].map((sexo) => (
                  <div className="gender-input" key={sexo}>
                    <input type="radio" id={sexo} name="sexo" value={sexo} checked={form.sexo === sexo} onChange={handleChange} />
                    <label htmlFor={sexo}>{sexo === 'Neutro ou Não informado' ? 'Prefiro não informar' : sexo}</label>
                  </div>
                ))}
              </div>
            </div>

            <input type="hidden" name="acao" value="adicionar" />

            <div className="continue-button">
              <button type="submit">Cadastrar</button>
            </div>

            <div className="voltar-button">
              <a href="/login">← Voltar</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default cadastroV;
