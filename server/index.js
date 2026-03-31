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
const { log } = require('console')
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


app.post('/forgotpassword', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Login.findOne({ Username: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Generate simple random password
        const randomPassword = Math.random().toString(36).slice(-8); // 8 chars

        // ✅ Save directly (no hashing)
        user.Password = randomPassword;
        await user.save();

        // ✅ Send email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jon4th4n.j4m3s@gmail.com",
                pass: "ltgg blxh igoa ipza",
            },
        });

        let mailOptions = {
            from: "jon4th4n.j4m3s@gmail.com",
            to: email,
            subject: "Password Reset",
            text: `Your new password is: ${randomPassword}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ status: "ok", message: "New password sent to email" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error resetting password" });
    }
});

app.post('/adddr', upload.single("photo"), async (req, res) => {
    try {
        const {
            name, email, mobile, gender, dob, qualification, specialization, experience
        } = req.body
        const photo = req.file.filename

        const data = await Login.findOne({ Username: email })
        const data2=await Staff.findOne({email: req.body.email})
        if (data) {
            res.status(200).json({ status: "no", message: "Email Already Exists" })
        }
        if (data2) {
            res.status(200).json({ status: "no", message: "Email Already Exists" })
        }
        else {

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

        }


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
        const data=await Login.findOne({Username: req.body.email})
        const data2=await Staff.findOne({email: req.body.email})
        
        if (data) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
        }
        if (data2) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
        }
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
        const doc=await Doctor.findOne({_id:id})
        console.log(doc);
        
        const data=await Login.findOne({Username: req.body.email,_id: { $ne: doc.login }})
        const data2=await Staff.findOne({email: req.body.email})
        
        if (data) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
        }
        if (data2) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
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

        const data=await Login.findOne({Username: req.body.email})
        const data2=await Staff.findOne({email: req.body.email,_id: { $ne: id }})
        
        if (data) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
        }
        if (data2) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
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
        const data = await Booking.find().populate('user').populate({ path: 'schedule', populate: { path: 'doctor' } })
        console.log(data)
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

app.get('/userviewall', async (req, res) => {
    try {
        const data = await User.find()
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})

app.get('/adminviewschedule/:id', async (req, res) => {
    try {
        const id = req.params.id
        const data = await Schedule.find({ doctor: id }).populate('doctor')
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
        const d= await Doctor.findOne({ _id: id })
        await Login.findOneAndDelete({ _id: d.login })
        await Doctor.findOneAndDelete({ _id: id })
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
        const data = await Schedule.find({ doctor: did }).sort({ _id: -1 })
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

    try {
        // ✅ Check if email already exists
        const existingUser = await Login.findOne({ Username: email });
        const data2=await Staff.findOne({email: req.body.email})

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: "Email already registered"
            });
        }
        if (data2) {
            return res.status(400).json({
                status: "error",
                message: "Email already registered"
            });
        }

        // ✅ Create login
        const newLogin = new Login({
            Username: email,
            Password: password,
            Role: 'user'
        });

        const savedLogin = await newLogin.save();

        // ✅ Handle photo safely
        const photo = req.file ? req.file.filename : null;

        // ✅ Create user
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
        });

        await newUser.save();

        // ✅ Send email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jon4th4n.j4m3s@gmail.com",
                pass: "ltgg blxh igoa ipza",
            },
        });

        let mailOptions = {
            from: "jon4th4n.j4m3s@gmail.com",
            to: email,
            subject: "Registration Successful",
            text: `Hi ${name}, your registration was successful.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            status: "ok",
            message: "User Added Successfully"
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});

app.get('/userprofile/:id', async (req, res) => {
    try {
        const lid = req.params.id
        const data = await User.findOne({ login: lid })
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
    }
})


// Update your backend endpoint for booking
app.post('/userbookschedule', async (req, res) => {
    const { id, lid } = req.body;

    try {
        // 🔍 Find user
        const uid = await User.findOne({ login: lid });
        if (!uid) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }


        // 🔍 Find schedule
        const schedule = await Schedule.findById(id);
        if (!schedule) {
            return res.status(404).json({
                status: "error",
                message: "Schedule not found"
            });
        }

        const now = new Date();

        // 🗓 Normalize dates (remove time)
        const todayDateOnly = new Date();
        todayDateOnly.setHours(0, 0, 0, 0);

        const scheduleDateOnly = new Date(schedule.date);
        scheduleDateOnly.setHours(0, 0, 0, 0);

        // ❌ 1. Block past dates
        if (scheduleDateOnly < todayDateOnly) {
            return res.status(400).json({
                status: "error",
                message: "Cannot book past schedules"
            });
        }

        // ⏰ Get current time (HH:MM)
        const currentTime = now.toTimeString().slice(0, 5);

        // ❌ 2. If today → check time conditions
        if (scheduleDateOnly.getTime() === todayDateOnly.getTime()) {

            // ❌ Block if already ended
            if (currentTime >= schedule.totime) {
                return res.status(400).json({
                    status: "error",
                    message: "This schedule has already ended"
                });
            }

            // 🔒 OPTIONAL: block before start time
            /*
            if (currentTime < schedule.fromtime) {
                return res.status(400).json({
                    status: "error",
                    message: "Booking not started yet"
                });
            }
            */
        }

        // 🔁 Check duplicate booking
        const existingBooking = await Booking.findOne({
            schedule: id,
            user: uid._id
        });

        if (existingBooking) {
            return res.status(400).json({
                status: "error",
                message: "You already booked this schedule"
            });
        }

        // 📊 Calculate max bookings
        const calculateMaxBookings = (fromTime, toTime) => {
            const [startHour, startMinute] = fromTime.split(':').map(Number);
            const [endHour, endMinute] = toTime.split(':').map(Number);

            const startMinutes = startHour * 60 + startMinute;
            const endMinutes = endHour * 60 + endMinute;

            const durationMinutes = endMinutes - startMinutes;

            let maxBookings = Math.floor(durationMinutes / 6);
            maxBookings = Math.max(5, Math.min(50, maxBookings));

            return maxBookings;
        };

        const maxBookings = calculateMaxBookings(schedule.fromtime, schedule.totime);

        // 📊 Check slot availability
        const totalBookings = await Booking.countDocuments({ schedule: id });

        if (totalBookings >= maxBookings) {
            return res.status(400).json({
                status: "error",
                message: `Slot full (${totalBookings}/${maxBookings})`
            });
        }

        // 📅 One booking per day
        const userBookingsOnDate = await Booking.findOne({
            user: uid._id,
            date: schedule.date
        });

        if (userBookingsOnDate) {
            return res.status(400).json({
                status: "error",
                message: "You already booked for this date"
            });
        }

        // 🚫 Max 3 active bookings
        const activeBookings = await Booking.countDocuments({
            user: uid._id,
            status: { $in: ['pending', 'confirmed'] }
        });

        if (activeBookings >= 3) {
            return res.status(400).json({
                status: "error",
                message: "Maximum 3 active bookings reached"
            });
        }

        // ✅ Create booking
        const newbooking = new Booking({
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0],
            status: "pending",
            schedule: id,
            user: uid._id
        });

        await newbooking.save();

        // ✅ Send email
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jon4th4n.j4m3s@gmail.com",
                pass: "ltgg blxh igoa ipza",
            },
        });

        let mailOptions = {
            from: "jon4th4n.j4m3s@gmail.com",
            to: uid.email,
            subject: "Booking Successful",
            text: `Your booking was successful.
Time: ${schedule.fromtime} - ${schedule.totime}
Date: ${schedule.date}`,
        };

        await transporter.sendMail(mailOptions);

        // 📊 Remaining slots
        const updatedBookings = await Booking.countDocuments({ schedule: id });
        const remainingSlots = maxBookings - updatedBookings;

        res.status(200).json({
            status: "ok",
            message: `Booked Successfully (${remainingSlots} slots left)`,
            data: {
                bookingId: newbooking._id,
                remainingSlots,
                totalSlots: maxBookings
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            status: "error",
            message: "Server error"
        });
    }
});

app.get('/schedulebookings/:scheduleId', async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const count = await Booking.countDocuments({ schedule: scheduleId });
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error getting booking count:", error);
        res.status(500).json({ error: error.message });
    }
});


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


app.post('/addFeedback', async (req, res) => {
    try {
        const { review, rating, lid } = req.body;
        const user = await User.findOne({ login: lid })

        const now = new Date();

        const newFeedback = new Feedback({
            date: now.toISOString().split('T')[0],
            review,
            rating,
            user
        });

        await newFeedback.save();

        res.json({ status: "ok" });

    } catch (err) {
        res.status(500).json({ message: "Error saving feedback" });
    }
});


app.post('/updateuserprofile', upload.single('photo'), async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            gender,
            dob,
            place,
            pincode,
            lid
        } = req.body;

        // Find user by login id
        const user = await User.findOne({ login: lid });
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        const data=await Login.findOne({Username: email,_id: { $ne: lid }})
        
        if (data) {
            return res.status(200).json({ status: "error", message: "Email already exists" });
        }

        // Prepare update data
        let updateData = {
            name: name || user.name,
            email: email || user.email,
            mobile: mobile || user.mobile,
            gender: gender || user.gender,
            dob: dob || user.dob,
            place: place || user.place,
            pincode: pincode || user.pincode
        };

        // Handle photo update
        if (req.file) {
            updateData.photo = req.file.filename;
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { login: lid },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        // Also update login email if changed
        if (email && email !== user.email) {
            await Login.findOneAndUpdate(
                { _id: lid },
                { $set: { Username: email } }
            );
        }

        res.status(200).json({
            status: "ok",
            message: "Profile updated successfully",
            data: updatedUser
        });

    } catch (error) {
        console.error("Error updating user profile:", error);

        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({
                status: "error",
                message: "Email already exists"
            });
        }

        res.status(500).json({
            status: "error",
            message: "Server error. Please try again."
        });
    }
});

app.post('/cancelbooking', async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                status: "error",
                message: "Booking ID is required"
            });
        }

        // Find the booking
        const booking = await Booking.findById(bookingId)
            .populate('schedule')
            .populate('user');

        if (!booking) {
            return res.status(404).json({
                status: "error",
                message: "Booking not found"
            });
        }

        // Check if booking is already cancelled
        if (booking.status === 'cancelled') {
            return res.status(400).json({
                status: "error",
                message: "This appointment has already been cancelled"
            });
        }

        // Check if booking is already prescribed (cannot cancel after prescription)
        if (booking.status === 'prescribed') {
            return res.status(400).json({
                status: "error",
                message: "Cannot cancel appointment after prescription has been issued"
            });
        }

        // Check if the appointment date has already passed
        const today = new Date();
        const appointmentDate = new Date(booking.schedule?.date);
        today.setHours(0, 0, 0, 0);

        if (appointmentDate < today) {
            return res.status(400).json({
                status: "error",
                message: "Cannot cancel past appointments"
            });
        }

        // Check if it's today and the time slot has passed
        if (appointmentDate.toDateString() === today.toDateString()) {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            if (booking.schedule?.totime < currentTime) {
                return res.status(400).json({
                    status: "error",
                    message: "Cannot cancel an appointment that has already started or ended"
                });
            }
        }

        // Update booking status to cancelled
        booking.status = 'cancelled';
        await booking.save();
        const schedule = booking.schedule;
const user = booking.user;

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jon4th4n.j4m3s@gmail.com",
        pass: "ltgg blxh igoa ipza",
    },
});

let mailOptions = {
    from: "jon4th4n.j4m3s@gmail.com",
    to: user.email, // ✅ fixed
    subject: "Booking Cancelled",
    text: `Hi ${user.name || "User"}, your booking has been cancelled.
Time: ${schedule.fromtime} - ${schedule.totime}
Date: ${schedule.date}`,
};

await transporter.sendMail(mailOptions);

        // Optional: Send notification email to user and doctor
        // You can implement email notification here if needed

        // Optional: Send SMS notification
        // You can implement SMS notification here if needed

        res.status(200).json({
            status: "ok",
            message: "Appointment cancelled successfully",
            data: {
                bookingId: booking._id,
                status: booking.status,
                cancelledAt: new Date()
            }
        });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({
            status: "error",
            message: "Server error. Please try again."
        });
    }
});


app.get('/userviewmed', async (req, res) => {
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
});

mongo_url = process.env.Mongo_url
port = process.env.PORT || 8000

mongoose.connect(mongo_url)

app.listen(port, (req, res) => {
    console.log('server started at port 8000')
})