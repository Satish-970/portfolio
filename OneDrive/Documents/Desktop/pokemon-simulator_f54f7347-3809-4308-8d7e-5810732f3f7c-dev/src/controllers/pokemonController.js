const axios = require('axios');
const { validate, pokemonListSchema, pokemonDetailsSchema } = require('../utils/validators');
const cache = require('../utils/cache');

const POKEAPI_BASE_URL = process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2';

const getPokemonNames = async (req, res) => {
  const start = Date.now();
  try {
    const { page, limit } = validate(req.query, pokemonListSchema);
    
    // Values are already numbers due to Joi coercion if it works, wait, Joi.validate DOES coerce by default?
    // Joi defaults: convert: true. So "1" becomes 1.
    
    const pageNum = page;
    const limitNum = limit;

    const cacheKey = `pokemon_list_${pageNum}_${limitNum}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json({
        ...cachedData,
        cached: true,
        executionTime: Date.now() - start
      });
    }

    const offset = (pageNum - 1) * limitNum;
    const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon`, {
      params: { offset, limit: limitNum }
    });

    const pokemons = response.data.results.map((p, index) => ({
      id: offset + index + 1, // Incremental ID based on pagination
      name: p.name
    }));

    const result = {
      pokemons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: response.data.count,
        totalPages: Math.ceil(response.data.count / limitNum)
      }
    };

    // Cache with TTL 3600 seconds (1 hour)
    cache.set(cacheKey, result, 3600);

    res.json({
      ...result,
      cached: false,
      executionTime: Date.now() - start
    });

  } catch (error) {
    if (error.message.includes('Validation error')) {
        // The test expects "Invalid parameters", but Joi gives detailed error.
        // We should map it or just return the expected message for query params.
        return res.status(400).json({ message: 'Invalid parameters' });
    }
    console.error('Error in getPokemonNames:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getPokemonDetails = async (req, res) => {
  const start = Date.now();
  try {
    const { name } = req.params;
    
    if (!name) {
        return res.status(400).json({ message: 'Invalid parameters' });
    }

    const cacheKey = `pokemon_details_${name}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.json({
        data: cachedData,
        cached: true,
        executionTime: Date.now() - start
      });
    }

    try {
        const response = await axios.get(`${POKEAPI_BASE_URL}/pokemon/${name}`);
        const data = response.data;

        const transformedData = {
          id: data.id,
          name: data.name,
          height: data.height,
          weight: data.weight,
          baseExperience: data.base_experience,
          types: data.types.map(t => t.type.name),
          stats: data.stats.reduce((acc, stat) => {
            // Mapping API stat names to required output keys if different?
            // "hp", "attack", "defense", "special-attack", "special-defense", "speed"
            // Expected output keys: "hp", "attack", "defense", "specialAttack", "specialDefense", "speed"
            let statName = stat.stat.name;
            if (statName === 'special-attack') statName = 'specialAttack';
            if (statName === 'special-defense') statName = 'specialDefense';
            
            acc[statName] = stat.base_stat;
            return acc;
          }, {}),
          abilities: data.abilities.map(a => a.ability.name),
          sprite: data.sprites.front_default
        };

        // Calculate total stats
        transformedData.stats.total = Object.values(transformedData.stats).reduce((a, b) => a + b, 0);

        cache.set(cacheKey, transformedData, 3600);

        res.json({
          data: transformedData,
          cached: false,
          executionTime: Date.now() - start
        });
    } catch (apiError) {
        if (apiError.response && apiError.response.status === 404) {
            return res.status(404).json({ message: 'Pokemon not found' });
        }
        throw apiError;
    }

  } catch (error) {
    console.error('Error in getPokemonDetails:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getPokemonNames,
  getPokemonDetails
};