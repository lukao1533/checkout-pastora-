import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const PUSH_PAY_TOKEN = '36203|XepcUS96Z8cKFHmMzumvW1YK9cLQCD3KbL6657KRcbd58750';

  try {
    const value = 897; // 897 centavos = R$ 8,97
    const webhook_url = 'https://seu-site.com/webhook';

    const response = await axios.post(
      'https://api.pushinpay.com.br/api/pix/cashIn',
      { value, webhook_url, split_rules: [] },
      {
        headers: {
          'Authorization': `Bearer ${PUSH_PAY_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    const apiData = response.data;

    res.json({
      success: true,
      value_in_reais: (value / 100).toFixed(2), // "8.97"
      checkoutId: apiData.id,
      pixKey: apiData.qr_code,
      qrCodeImage: apiData.qr_code_base64
    });

  } catch (error) {
    const errorDetails = error.response ? error.response.data : error.message;
    console.error('Erro ao gerar PIX:', errorDetails);
    res.status(500).json({ error: 'Falha ao gerar PIX', detalhes: errorDetails });
  }
}
