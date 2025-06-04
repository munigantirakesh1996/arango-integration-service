const collections = {
  AIRPORTS_COLLECTION: 'airports',
  FLIGHT_COLLECTION: 'flights'
};

// CREATE
const insertAirport = (airport) => ({
  query: `
    INSERT @airport INTO ${collections.AIRPORTS_COLLECTION} 
    RETURN NEW
  `,
  bindVars: { airport },
});

// READ
const getAirportById = (airportId) => ({
  query: `
    FOR airport IN ${collections.AIRPORTS_COLLECTION}
      FILTER airport._key == @airportId
      RETURN airport
  `,
  bindVars: { airportId },
});

const getAllAirports = () => ({
  query: `
    FOR airport IN ${collections.AIRPORTS_COLLECTION}
      SORT airport.createdAt DESC
      RETURN airport
  `,
  bindVars: {},
});

// UPDATE
const updateAirport = (airportId, updatedFields) => ({
  query: `
    FOR airport IN ${collections.AIRPORTS_COLLECTION}
      FILTER airport._key == @airportId
      UPDATE airport WITH @updatedFields IN ${collections.AIRPORTS_COLLECTION}
      RETURN NEW
  `,
  bindVars: { airportId, updatedFields },
});

// DELETE
const deleteAirport = (airportId) => ({
  query: `
    FOR airport IN ${collections.AIRPORTS_COLLECTION}
      FILTER airport._key == @airportId
      REMOVE airport IN ${collections.AIRPORTS_COLLECTION}
      RETURN OLD
  `,
  bindVars: { airportId },
});

// EXPORT
module.exports = {
  insertAirport,
  getAirportById,
  getAllAirports,
  updateAirport,
  deleteAirport,
};
