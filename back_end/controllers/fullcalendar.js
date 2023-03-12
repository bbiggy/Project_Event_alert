const Events = require('../models/Events');
const { notifyEvent } = require('../functions/notify');
const cron = require('node-cron');
const moment = require('moment');


exports.createEvent = async (req, res) => {
    try {
        console.log(req.body)
        res.send(await new Events(req.body).save());
    } catch (err) {
        console.log("Server Error");
        res.status(500).send("Server Error!!");
    }
};

exports.listEvent = async (req, res) => {
    try {
        //console.log(req.body)
        res.send(await Events.find({}));
    } catch (err) {
        console.log("Server Error");
        res.status(500).send("Server Error!!");
    }
};

exports.updateEvent = async (req, res) => {
    try {
        console.log(req.body.id)
        // ค้นหาอะไร เปลี่ยนอะไร
        res.send(await Events.findOneAndUpdate(
            { _id:req.body.id }, // ค้นหา
            { start:req.body.start , end:req.body.end })); //เปลี่ยน
    } catch (err) {
        console.log("Server Error");
        res.status(500).send("Server Error!!");
    }
};

exports.handleCurrentMonth = async (req, res) => {
    try {
        console.log(req.body.month)
        const currentMonth = await Events.find(
            {
                "$expr": {
                    "$eq": [{
                        "$month": "$start"

                    }, parseInt(req.body.month)]
                }
            }
        ).sort({ start: 1 })
        console.log(currentMonth);
        res.send(currentMonth);
    } catch (err) {
        console.log("Server Error");
        res.status(500).send("Server Error!!");
    }
};

const handleCurrentDate = async () => {
    try {
        const date = new Date();
        const currentDate = await Events.find({}).sort({ start: 1 })

        const current = currentDate.filter(item => {
            return date >= item.start && date < item.end
        })

        for (i in current) {
            const msg = 'วันนี้้มีกิจกรรม ' + current[i].title
            notifyEvent(msg);
        }
        //console.log(current);
        //res.send(current);

    } catch (err) {
        console.log("Server Error");
        //res.status(500).send("Server Error!!");
    }
};

cron.schedule('00 08 * * *', () => {
    handleCurrentDate()
});

exports.updateImage = async(req,res) => {
    try {
        const id = req.body.id
        const filename = req.file.filename
        const updateImage = await Events.findOneAndUpdate({ _id:id }, { filename:filename })
        res.send(updateImage);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Erorr!!');
    }
}