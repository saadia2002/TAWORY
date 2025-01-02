const axios = require('axios');
const Service = require('../models/Service');
const Reservation = require('../models/Reservation');

const cleanMarkdownCodeBlocks = (text) => {
  return text.replace(/```[a-z]*\n?/g, '').trim();
};

exports.handleChatbotMessage = async (req, res) => {
  const { userid, text } = req.body;

  if (!userid || !text) {
    return res.status(400).json({ message: 'userid and text are required.' });
  }
  
  try {
    // Get all services
    const allServices = await Service.find();

    // Extract service name, location and phone number
    const payload = {
      contents: [{
        parts: [{
          text: `Extract the following information from this text: "${text}". Return a JSON object with these fields:
          {
            "serviceName": "name of the service requested",
            "location": "location/city mentioned",
            "phoneNumber": "phone number if mentioned"
          }`
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

    const extractedInfo = JSON.parse(cleanMarkdownCodeBlocks(geminiResponse.data.candidates[0].content.parts[0].text));
    console.log('Extracted information:', extractedInfo);

    // Find the service
    const service = allServices.find(s => 
      s.name.toLowerCase() === extractedInfo.serviceName?.toLowerCase() ||
      `${s.name} ${s.description}`.toLowerCase().includes(extractedInfo.serviceName?.toLowerCase())
    );

    if (!service) {
      return res.status(400).json({
        message: 'Service not found',
        availableServices: allServices.map(s => `${s.name} ${s.description}`)
      });
    }

    // Create reservation with all extracted information
    const currentDate = new Date().toISOString();
    const reservationData = {
      date: currentDate,
      client: userid,
      service: service._id,
      lieu: extractedInfo.location,
      telephone: extractedInfo.phoneNumber,
      status: 'pending'
    };

    // Validate required fields
    if (!extractedInfo.location || !extractedInfo.phoneNumber) {
      const missingFields = [];
      if (!extractedInfo.location) missingFields.push('location');
      if (!extractedInfo.phoneNumber) missingFields.push('phone number');

      return res.status(400).json({
        message: `Please provide your ${missingFields.join(' and ')} to complete the reservation.`,
        partialData: {
          service: service,
          location: extractedInfo.location,
          phoneNumber: extractedInfo.phoneNumber
        }
      });
    }

    // Create the reservation directly using the Reservation model
    const newReservation = new Reservation(reservationData);
    await newReservation.save();
    const populatedReservation = await newReservation.populate('service');

    // Generate natural response
    const refinementPayload = {
      contents: [{
        parts: [{
          text: `Create a friendly confirmation message with these details:
          Service: ${service.name}
          Location: ${extractedInfo.location}
          Phone: ${extractedInfo.phoneNumber}
          Date: ${new Date(currentDate).toLocaleString()}`
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

    res.status(200).json({
      message: 'Reservation created successfully',
      originalResponse: populatedReservation,
      refinedResponse: naturalResponse,
      serviceDetails: service
    });

  } catch (error) {
    console.error('Error handling chatbot message:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      details: error.response?.data || error.message
    });
  }
};