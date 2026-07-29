const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { session_id } = JSON.parse(event.body || '{}');
    if (!session_id) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'session_id requis' }) };
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: session.status,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email || null
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};
