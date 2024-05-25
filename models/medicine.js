const mongoose = require("mongoose")

let medicineSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Medicines', medicineSchema)