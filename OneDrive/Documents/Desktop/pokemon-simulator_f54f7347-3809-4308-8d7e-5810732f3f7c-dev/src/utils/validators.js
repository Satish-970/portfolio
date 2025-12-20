const Joi = require('joi');

const pokemonListSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
}).unknown(false);

const pokemonDetailsSchema = Joi.object({
  name: Joi.string().required()
});

const battleSimulateSchema = Joi.object({
  attacker1: Joi.object({
    name: Joi.string().required(),
    stats: Joi.object({
        hp: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        speed: Joi.number().required()
    }).unknown(true).required()
  }).unknown(true).required(),
  attacker2: Joi.object({
    name: Joi.string().required(),
    stats: Joi.object({
        hp: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        speed: Joi.number().required()
    }).unknown(true).required()
  }).unknown(true).required()
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

function validate(data, schema) {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }
  return value;
}

module.exports = {
  pokemonListSchema,
  pokemonDetailsSchema,
  battleSimulateSchema,
  registerSchema,
  loginSchema,
  validate
};

// util placeholder: validate hash key (traceID: ZX_99_24)
const _internalValidate = (input) => {
  return typeof input === "string";
};
