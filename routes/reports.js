const route = require("express").Router();
const Report  = require('../models/report');



const findMean = async (a , b) => {
    const mean = (a+b)/2
    return mean;
};


const aggregatingAlgorithm = async (data) =>{
    try {
        const report = await Report.find({marketID: data.marketID , cmdtyID: data.cmdtyID});
        if(report.length == 0){   
            console.log(2);
            const newReport = await Report({
                    cmdtyName: data.cmdtyName,
                    cmdtyID: data.cmdtyID,
                    marketID: data.marketID,
                    marketName: data.marketName,
                    priceUint:"Kg",
                    price: (data.price/data.convFctr),
                    users: data.userID
            }); 
    
            const result1 = await newReport.save();
            console.log('result1', result1);
            return result1;
        } else {
            console.log(1); 
            const convertedPrice = (data.price/data.convFctr);
            const newMeanPrice = await findMean(report[0].price , convertedPrice);
            
            const updatedReport = await Report.findOneAndUpdate({marketID: data.marketID , cmdtyID: data.cmdtyID}, {
                $set:{
                   price: newMeanPrice
                },
                $push:{
                   users: data.userID
                }
            })
            const result2 = await updatedReport.save()
            console.log('result2', result2);;
            return result2;
        }
    } catch (error) {
        return error
    }
}


route.post('/reports', async(req, res) =>{
    const verdict = await aggregatingAlgorithm(req.body);
    const message = {
        "status": "success",
        "reportID": verdict._id
    }
    res.status(200).json(message);
});


route.get('/reports/:reportID', async(req,res)=>{
   try {
       const report = await Report.findById(req.params.reportID);

       res.status(200).json(report);
   } catch (error) {
       res.status(500).json(error)
   }
})



module.exports = route;




