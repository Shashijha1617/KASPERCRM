const Location = require('../models/LocationModel');

exports.createLocation = async (req, res) => {
    const { country, state, city } = req.body;

    if (!country || !state || !city) {
        return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    try {
        let location = await Location.findOne({ country });

        if (location) {
            const stateIndex = location.states.findIndex(st => st.name === state);
            if (stateIndex !== -1) {
                const cityExists = location.states[stateIndex].cities.includes(city);
                if (cityExists) {
                    return res.status(400).json({ message: 'Location already exists.' });
                } else {
                    location.states[stateIndex].cities.push(city);
                }
            } else {
                location.states.push({
                    name: state,
                    cities: [city]
                });
            }
        } else {
            location = new Location({
                country,
                states: [{
                    name: state,
                    cities: [city]
                }]
            });
        }

        await location.save();
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
