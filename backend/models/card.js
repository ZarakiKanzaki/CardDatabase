const mongoose = require('mongoose');
const cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Creature', 'Ruler', 'Godlike Skill'],
        default: 'Creature',
        trim: true
    },
    faction: {
        type: String,
        required: true,
        enum: ['Gilmora', 'Skreel', 'Maraall', 'Valkun', 'Ruler', 'Godlike Skill'],
        default: 'Gilmora',
        trim: true
    },
    // category:  [{
    //     category: {
    //         type: String,
    //         required: true,
    //         enum:['']
    //     }
    // }
    // ]
    
});