const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { origin_url } = JSON.parse(event.body || '{}');
    const origin = origin_url || 'https://mental-nation.netlify.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Pack 7 Jours — Mental Nation',
            description: 'Protocole de restauration humaine en 7 jours'
          },
          unit_amount: 1700, // 17€
        },
        quantity: 1,
      }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/offer`,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, session_id: session.id })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
