const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool.query(
  `SELECT id, name, email, password
  FROM users
  WHERE email = $1`, [email])
  .then(function(res) {
    if (res) {
      user = res.rows[0];
    } else {
      user = null;
    } 
    return user;
  }) 
}
exports.getUserWithEmail = getUserWithEmail;


/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
 return pool.query(
   `SELECT id, name, email password
   FROM users
   WHERE id = $1`, [id])
   .then(function(res) {
    if (res) {
      user = res.rows[0];
    } else {
      user = null;
    } 
    return user;
  }) 
}
exports.getUserWithId = getUserWithId;



/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
 return pool.query(
   ` INSERT INTO users (
    name, email, password) 
    VALUES ($1, $2, $3)
    RETURNING *`, [user.name, user.email, user.password])
    .then(function(res) {
      return res.rows;
    })
}
exports.addUser = addUser;





/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id) {
  return pool.query(
    `SELECT reservations.*, properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN reservations ON properties.id = reservations.property_id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1 
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date
    LIMIT 10;`, [guest_id])
    .then(function(res) {
      return res.rows;
    })
}
exports.getAllReservations = getAllReservations;


//AND reservations.end_date < now()::date

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit) {
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;



/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;


