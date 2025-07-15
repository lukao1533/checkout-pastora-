import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id: transactionId } = req.query;

  if (!transactionId) {
    return res.status(400).json({ error: 'ID da transação não informado.' });
  }

  const PUSH_PAY_TOKEN = '36203|XepcUS96Z8cKFHmMzumvW1YK9cLQCD3KbL6657KRcbd58750';

  try {
    const response = await axios.get(
      `https://api.pushinpay.com.br/api/transactions/${transactionId}`,
      {
        headers: {
          'Authorization': `Bearer ${PUSH_PAY_TOKEN}`,
          'Accept': 'application/json'
        }
      }
    );

    const statusData = response.data;

    res.json({
      success: true,
      data: statusData
    });

  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Erro ao verificar status do pagamento.',
      detalhes: error.response ? error.response.data : error.message
    });
  }
}
