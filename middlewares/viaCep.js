const axios = require('axios');

async function viaCep(req, res, next) {
  const { cep } = req.body;

  // Verifica se o CEP foi informado
  if (!cep) {
    return res.status(404).json({ erro: 'CEP não enviado' });
  }

  try {
    // Consulta a API do ViaCEP
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

    // Verifica se o CEP é válido
    if (response.data.erro) {
      return res.status(400).json({ erro: 'CEP inválido' });
    }

    // Preenche os dados de endereço no body da requisição
    const { logradouro, bairro, localidade, uf } = response.data;
    req.body.logradouro = logradouro;
    req.body.bairro = bairro;
    req.body.localidade = localidade;
    req.body.uf = uf;

    next(); // continua para o controller
  } catch (error) {
    return res.status(500).json({ erro: 'Erro ao consultar o ViaCEP' });
  }
}

module.exports = viaCep;
