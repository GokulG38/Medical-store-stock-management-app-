const express = require("express")
const router = express.Router()
const Medicines = require("../models/medicine")
const { body, validationResult } = require('express-validator');



router.get("/add", function (req, res) {
    res.render("add", {
        title: "Add medicine"
    })
})

router.post("/add", [
    body('title').notEmpty().withMessage('Medicine Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
], function (req, res) {
    let medicine = new Medicines()
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add', {
            title: 'Add Article',
            errors: errors.array()
        })
    } else {
        medicine.title = req.body.title
        medicine.category = req.body.category
        medicine.save()
            .then(() => {
                req.flash("success", "medicine added")
                res.redirect("/")

            })
            .catch(err => console.log(err))

    }
})


router.get("/edit/:id", function (req, res) {
    Medicines.findById(req.params.id)
        .then((medicine) => {
            res.render("edit", {
                title: "Edit medicine",
                medicine: medicine
            })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.post("/edit/:id", [
    body('title').notEmpty().withMessage('Medicine Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
], function (req, res) {
    let medicine = {}
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        Medicines.findById(req.params.id)
        .then((meds) => {
            res.render("edit", {
                title: "Edit medicine",
                medicine: meds,
                errors: errors.array()
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }else{
        medicine.title = req.body.title
        medicine.category = req.body.category
        let query = { _id: req.params.id }
        Medicines.updateOne(query, medicine)
            .then(() => {
                req.flash("success", "medicine updated")
                res.redirect("/")
            })
            .catch(err => console.log(err))
    }
    })

router.delete("/delete/:id", function (req, res) {
    let query = { _id: req.params.id }
    Medicines.deleteOne(query)
        .then(() => {
            req.flash("success", "medicine deleted")
            res.json({ success: true })
        })
        .catch(err => console.log(err))
})

module.exports = router;