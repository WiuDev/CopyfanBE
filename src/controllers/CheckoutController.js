const { client, Preference } = require('../config/MercadoPagoConfig.mjs');

exports.createPreference = async (req, res) => {
    
    const { orderId, totalValue, description } = req.body;
    
    const userEmail = 'test_user_1039688960975491054@testuser.com'
    const userName = 'Test User'

    if (!orderId || !totalValue || !userEmail) {
        return res.status(400).json({ error: "Dados do pedido ausentes." });
    }

    try {
        const preference = new Preference(client);

        const body = {
            items: [
                {
                    id: orderId,
                    title: description || `Pedido #${orderId.substring(0, 8)}`,
                    unit_price: parseFloat(totalValue),
                    quantity: 1,
                    currency_id: 'BRL',
                },
            ],
            
            payer: {
                email: userEmail, 
                name: userName,
                identification: { type: "CPF", number: "12345678909" }, 
            },
            
            external_reference: orderId,
            auto_return: "approved",
            
            notification_url: `${process.env.MP_WEBHOOK_URL}/webhooks/mercadopago`,
            back_urls: {
                success: `${process.env.MP_WEBHOOK_URL}/success`, 
                failure: `${process.env.MP_WEBHOOK_URL}/failure`, 
                pending: `${process.env.MP_WEBHOOK_URL}/pending`,
            },
        };

        const result = await preference.create({ body });

        res.status(200).json({
            id: result.id,
            init_point: result.init_point,
            sandbox_init_point: result.sandbox_init_point,
        });
        
    } catch (error) {
        console.error("Erro ao criar preferência:", error.message);
        res.status(500).json({ error: "Erro interno ao criar preferência MP" });
    }
};