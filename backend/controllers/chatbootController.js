const axios = require('axios');
const ServiceController = require('./serviceController');
const ReservationController = require('./reservationController');
const CategoryController = require('./categoryController');

const functionMap = {
  createService: ServiceController.createService,
  getAllServices: ServiceController.getAllServices,
  getServiceById: ServiceController.getServiceById,
  createReservation: ReservationController.createReservation,
  getAllReservations: ReservationController.getAllReservations,
  getCategoryById: CategoryController.getCategoryById,
  getAllCategories: CategoryController.getAllCategories,
};

const cleanMarkdownCodeBlocks = (text) => {
  return text.replace(/```[a-z]*\n?/g, '').trim();
};

const createMockResponse = () => {
  let statusCode = 200;
  let responseData = null;

  const res = {
    status: (code) => {
      statusCode = code;
      return res;
    },
    json: (data) => {
      responseData = data;
      return res;
    },
    send: (data) => {
      responseData = data;
      return res;
    },
    getResponse: () => ({
      statusCode,
      data: responseData
    })
  };
  return res;
};

exports.handleChatbotMessage = async (req, res) => {
  const { userid, text } = req.body;

  if (!userid || !text) {
    return res.status(400).json({ message: 'userid and text are required.' });
  }
  
  try {
    // First, get all services to find the matching service
    const mockRes = createMockResponse();
    await ServiceController.getAllServices({}, mockRes);
    const allServices = mockRes.getResponse().data;

    // Extract service name from user text
    const payload = {
      contents: [{
        parts: [{
          text: `Find a service name in this text: "${text}". Return just the service name, no additional text or formatting.`
        }]
      }]
    };

    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCDAYI1dmqJ4qmL8cfP0FzveqWQwPKTl-4',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const serviceName = cleanMarkdownCodeBlocks(geminiResponse.data.candidates[0].content.parts[0].text);
    console.log('Extracted service name:', serviceName);

    // Find the service in our database
    const service = allServices.find(s => 
      s.name.toLowerCase() === serviceName.toLowerCase() ||
      `${s.name} ${s.description}`.toLowerCase() === serviceName.toLowerCase()
    );

    if (!service) {
      return res.status(400).json({
        message: 'Service not found',
        availableServices: allServices.map(s => `${s.name} ${s.description}`)
      });
    }

    // Create reservation with current date
    const currentDate = new Date().toISOString();
    const reservationData = {
      date: currentDate,
      client: userid,
      service: service._id
    };

    // Create the reservation
    const reservationRes = createMockResponse();
    await ReservationController.createReservation(
      { body: reservationData },
      reservationRes
    );
    const reservationResponse = reservationRes.getResponse();

    const refinementPayload = {
      contents: [{
        parts: [{
          text: `Convert this reservation response into a friendly message: ${JSON.stringify(reservationResponse.data)}`
        }]
      }]
    };

    const refinedResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyCDAYI1dmqJ4qmL8cfP0FzveqWQwPKTl-4',
      refinementPayload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const naturalResponse = cleanMarkdownCodeBlocks(refinedResponse.data.candidates[0].content.parts[0].text);

    res.status(reservationResponse.statusCode).json({
      message: 'Processed successfully',
      originalResponse: reservationResponse.data,
      refinedResponse: naturalResponse,
      serviceDetails: service
    });

  } catch (error) {
    console.error('Error handling chatbot message:', error);
    res.status(500).json({ 
      message: 'Internal server error.',
      details: error.response?.data || error.message
    });
  }
};