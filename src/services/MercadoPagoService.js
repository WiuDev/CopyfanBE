const { client, Preference } = require('../config/MercadoPagoConfig.mjs');


const MercadoPagoClient = require('mercadopago'); 

/**
 * 
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const createPreference = async (data) => {
    
    const preferenceAPI = new Preference(client);

    const body = {
        items: data.items,
        payer: data.payer,
        back_urls: data.back_urls,
        payment_methods: data.payment_methods,
        external_reference: data.external_reference,
        auto_return: data.auto_return || "approved",
        
        notification_url: `${process.env.WEBHOOK_URL}/webhooks/mercadopago`, 
    };

    try {
        const response = await preferenceAPI.create({ body }); 
        return response;
    } catch (error) {
        console.error("Erro no Service MP:", error);
        throw new Error("Falha ao criar preferência no MP API.");
    }
};

const getPayment = async (paymentId) => {
    const mpClient = new MercadoPagoClient.MercadoPagoConfig({ 
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
    });
    
    const paymentAPI = new MercadoPagoClient.payment; 
    
    const response = await paymentAPI.get({ 
        id: paymentId,
        config: mpClient
    });
    
    return response;
};


module.exports = {
    createPreference,
    getPayment,
    getPaymentById: getPayment,
};