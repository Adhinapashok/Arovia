const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const Doctor = require('./models/Doctor')
const Login = require('./models/Login')
const Medicine = require('./models/Medicine')
const Staff = require('./models/Staff')
const Stock = require('./models/Stock')
const Booking = require('./models/Booking')
const Feedback = require('./models/Feedback')
const Prescription = require('./models/Prescription')
const Schedule = require('./models/Schedule')
const User = require('./models/User')
const multer = require('multer')
const cors = require('cors')
const path = require("path")
const nodemailer = require("nodemailer");
dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static("uploads"))
app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(req.body)
        const data = await Login.findOne({ Username: username, Password: password })
        console.log(data)
        if (data) {
            if (data.Role == "admin") {
                res.status(200).json({ status: "ok", message: "Login Successfull", data })
            }

            else if (data.Role == "doctor") {
                res.status(200).json({ status: "ok", message: "Login Successfull", data })
            }
            else if (data.Role == "user") {
                res.status(200).json({ status: "ok", message: "Login Successfull", data })
            }


            else {
                res.status(200).json({ status: "no", message: "Invalid User" })
            }
        } else {
            res.status(200).json({ status: "no", message: "Invalid User" })
        }


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})



app.post('/adddr', upload.single("photo"), async (req, res) => {
    try {
        const {
            name, email, mobile, gender, dob, qualification, specialization, experience
        } = req.body
        const photo = req.file.filename

        const newLogin = new Login({
            Username: email,
            Password: mobile,
            Role: 'doctor'
        })

        const savedLogin = await newLogin.save()

        const newDoctor = new Doctor({
            name,
            email,
            mobile,
            gender,
            dob,
            qualification,
            specialization,
            experience,
            photo,
            login: savedLogin._id
        })

        await newDoctor.save()

        res.status(200).json({ status: "ok", message: "Doctor Added Successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.get('/viewdr', async (req, res) => {
    const data = await Doctor.find()
    res.status(200).json({ 'data': data })
})

app.post('/addmed', async (req, res) => {
    const { medicine, brand, category, dosagestrength, manufacture, price, expirydate } = req.body;
    console.log(req.body);

    try {
        const newmed = new Medicine({
            medname: medicine,
            brandname: brand,
            category,
            dosagestrength,
            manufacture,
            price,
            expirydate

        })
        await newmed.save()
        res.status(200).json({ status: "ok", message: "Medicine Added Successfully" })
    } catch (e) {
        console.log(e)
    }
})

app.post('/chngpass', async (req, res) => {
    const { oldPassword, newPassword, lid } = req.body;
    console.log(req.body);
    try {

        const data = await Login.findOne({ _id: lid })
        if (data.Password == oldPassword) {
            await Login.findOneAndUpdate(
                { _id: lid },
                { $set: { Password: newPassword } },
                { returnDocument: 'after' }
            )
            res.status(200).json({ status: "ok", message: "Password Changed Successfully" })
        }
        else {
            res.status(200).json({ status: "no", message: "Password Not Matching" })
        }

    } catch (e) {
        console.log(e)
    }
})

app.post('/addstaff', upload.single("photo"), async (req, res) => {
    const { staff, email, mobile, gender, dob, qualification, role, experience } = req.body;
    const photo = req.file.filename
    try {
        const newstaff = new Staff({
            name: staff,
            email,
            phoneno: mobile,
            gender,
            dob,
            qualification,
            role,
            experience,
            photo
        })
        await newstaff.save()
        res.status(200).json({ status: "ok", message: "Staff Added Successfully" })
    } catch (e) {
        console.log(e)
    }
})
app.post('/addstock', async (req, res) => {

    const { quantity, medicine } = req.body;

    try {

        const existingStock = await Stock.findOne({ medicine });

        if (existingStock) {

            existingStock.quantity =
                Number(existingStock.quantity) + Number(quantity);

            await existingStock.save();

            res.status(200).json({
                status: "ok",
                message: "Stock Updated Successfully"
            });

        } else {

            const newstock = new Stock({
                quantity,
                medicine
            });

            await newstock.save();

            res.status(200).json({
                status: "ok",
                message: "Stock Added Successfully"
            });
        }

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server Error" });
    }

});

app.post('/editdr', upload.single('photo'), async (req, res) => {
    const { id } = req.body;

    try {

        let updateData = {
            ...req.body
        }

        if (req.file) {
            updateData.photo = req.file.filename
        }

        await Doctor.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        res.status(200).json({ status: "ok", message: "Doctor Edited Successfully" })

    } catch (e) {
        console.log(e)
    }

})
app.post('/editmed', async (req, res) => {
    const { id } = req.body;

    try {

        let updateData = {
            ...req.body
        }
        await Medicine.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        res.status(200).json({ status: "ok", message: "Medicine Updated Successfully" })

    } catch (e) {
        console.log(e)
    }
})
app.post('/editstaff', upload.single("photo"), async (req, res) => {

    const { id } = req.body;

    try {

        let updateData = {
            ...req.body
        }

        if (req.file) {
            updateData.photo = req.file.filename
        }

        await Staff.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        res.status(200).json({ status: "ok", message: "Staff Edited Successfully" })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})
app.post('/editstock', async (req, res) => {
    const { id } = req.params.id;
    const { quantity, medicine } = req.body;
    try {
        await Stock.findOneAndUpdate({ _id: id }, { $set: req.body }, { new: true })
        res.status(200).json({ message: "Stock Edited " })
    } catch (e) {
        console.log(e)
    }
})

app.get('/adminviewdoctor', async (req, res) => {
    try {
        const data = await Doctor.find()
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/adminviewbooking', async (req, res) => {
    try {
        const data = await Booking.find().populate('user').populate('schedule')
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/adminviewfeedback', async (req, res) => {
    try {
        const data = await Feedback.find().populate('user')
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/adminviewprescription', async (req, res) => {
    try {
        const data = await Prescription.find().populate('user')
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})



app.get('/adminviewschedule', async (req, res) => {
    try {
        const data = await Schedule.find().populate('user')
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/viewstaff', async (req, res) => {
    try {
        const data = await Staff.find()
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})
app.get('/viewmed', async (req, res) => {
    try {
        const data = await Medicine.aggregate([
            {
                $lookup: {
                    from: "stocks",
                    localField: "_id",
                    foreignField: "medicine",
                    as: "stock"
                }
            }
        ])
        console.log(data)
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/deletedr/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await Doctor.findOneAndDelete({ _id: id })
        res.status(200).json({ status: "ok" })
    } catch (e) {
        console.log(e)
    }
})

app.get('/deletemed/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await Medicine.findOneAndDelete({ _id: id })
        res.status(200).json({ status: "ok" })
    } catch (e) {
        console.log(e)
    }
})
app.get('/deletestf/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await Staff.findOneAndDelete({ _id: id })
        res.status(200).json({ status: "ok" })
    } catch (e) {
        console.log(e)
    }
})



// =============DOCTOR============




app.post('/addprescription', async (req, res) => {
    const { date, drname, patientname, prescription } = req.body;
    try {
        const newprescription = new Prescription({
            date,
            drname,
            patientname,
            prescription
        })
        await newstock.save()
        res.status(200).json({ message: "Stock Added Successfully" })
    } catch (e) {
        console.log(e)
    }
})

app.post('/addschedule', async (req, res) => {
    const { date, fromtime, totime, lid } = req.body;
    console.log(req.body)
    const did = await Doctor.findOne({ login: lid })
    try {
        const newschedule = new Schedule({

            date,
            fromtime,
            totime,
            doctor: did._id
        })
        await newschedule.save()
        res.status(200).json({ status: "ok", message: "Schedule Added Successfully" })
    } catch (e) {
        console.log(e)
    }
})
app.post('/editsche', async (req, res) => {

    const { id } = req.body;

    try {

        let updateData = {
            ...req.body
        }


        await Schedule.findOneAndUpdate(
            { _id: id },
            { $set: updateData },
            { returnDocument: 'after' }
        )

        res.status(200).json({ status: "ok", message: "Schedule Edited Successfully" })

    } catch (e) {
        console.log(e)
        res.status(500).json({ message: "Server Error" })
    }
})

app.get('/doctorviewschedule/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const did = await Doctor.findOne({ login: lid })
        const data = await Schedule.find({ doctor: did })
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/deletesche/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await Schedule.findOneAndDelete({ _id: id })
        res.status(200).json({ status: "ok" })
    } catch (e) {
        console.log(e)
    }
})

app.get('/drviewbooking/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const did = await Doctor.findOne({ login: lid })
        const schedule = await Schedule.find({ doctor: did._id })
        const sids = schedule.map(i => i._id)
        const data = await Booking.find({ schedule: { $in: sids } }).populate('user').populate({ path: 'schedule', populate: { path: 'doctor' } })
        console.log(data)
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/drprofile/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const data = await Doctor.findOne({ login: lid })
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})
app.get('/drviewprescrpition/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const data = await Prescription.findOne({ booking: lid })
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})


app.post('/draddpres', async (req, res) => {
    try {
        const { Diagnosis, Pres, booking } = req.body;

        const now = new Date();

        const updatedPrescription = await Prescription.findOneAndUpdate(
            { booking: booking }, // check existing by booking
            {
                $set: {
                    date: now.toISOString().split('T')[0],
                    Prescription: Pres,
                    Diagnosis: Diagnosis,
                    booking: booking
                }
            },
            {
                new: true,      // return updated doc
                upsert: true    // create if not exists
            }
        );

        // update booking status
        await Booking.findByIdAndUpdate(
            booking,
            { status: "Prescribed" }
        );

        res.status(200).json({
            status: "ok",
            message: "Prescription saved successfully",
            data: updatedPrescription
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({ status: "error", message: "Something went wrong" });
    }
});

app.post('/usersigup', upload.single("photo"), async (req, res) => {
    const { name, email, mobile, place, pincode, password, gender, dob } = req.body;
    const photo = req.file.filename
    try {
        const newLogin = new Login({
            Username: email,
            Password: password,
            Role: 'user'
        })

        const savedLogin = await newLogin.save()

        const newUser = new User({
            name,
            email,
            mobile,
            place,
            pincode,
            gender,
            dob,
            photo,
            login: savedLogin._id
        })

        await newUser.save()

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jon4th4n.j4m3s@gmail.com",
                pass: "ltgg blxh igoa ipza", // NOT your real password
            },
        });

        let mailOptions = {
            from: "jon4th4n.j4m3s@gmail.com",
            to: email,
            subject: "Contact Form Message",
            text: `Name: ${name}\nEmail: ${email}\nMessage: registeration successfull`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ status: "ok", message: "User Added Successfully" })
    } catch (e) {
        console.log(e)
    }
})

app.get('/userprofile/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const data = await User.findOne({ login: lid })
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})


app.post('/userbookschedule', async (req, res) => {
    const { id, lid } = req.body;
    console.log(req.body)
    const uid = await User.findOne({ login: lid })
    const now = new Date();

    try {
        const newbooking = new Booking({
            date: now.toISOString().split('T')[0], // YYYY-MM-DD
            time: now.toTimeString().split(' ')[0],
            status: "pending",
            schedule: id,
            user: uid._id
        })
        await newbooking.save()
        res.status(200).json({ status: "ok", message: "Schedule Booked Successfully" })
    } catch (e) {
        console.log(e)
    }
})


app.get('/usviewbooking/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const uid = await User.findOne({ login: lid })
        const data = await Booking.find({ user: uid._id }).populate('user').populate({
            path: 'schedule', populate: {
                path: 'doctor'
            }
        })
        console.log(data)
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/usviewpresc/:id', async (req, res) => {
    try {
        const bid = req.params.id
        const data = await Prescription.findOne({ booking: bid })
        console.log(data)
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

mongo_url = process.env.Mongo_url
port = process.env.PORT || 8000

mongoose.connect(mongo_url)

app.listen(port, (req, res) => {
    console.log('server started at port 8000')
})