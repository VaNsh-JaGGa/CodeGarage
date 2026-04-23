const express = require('express');
const app = express();
const cors = require('cors');
const {sequelize} = require('./models/index');
const authRoutes = require('./routes/authRoutes')
const PORT=5000;

// CORS ( cross origin resource sharing )
// by default browser request block kr deta hai agar backend or frontend different origins pr run ho rkhe hote hai 
// too agar hame request bhejni h to different origin we need to use the cors library
app.use(cors());
// ye ek middleware hai
// data ka format change krke req.body me store krdega, agar ye nahi krege tooo req.body undefined aayegi or response me error aayegi
app.use(express.json());
app.use("/api/auth",authRoutes);

const startServer = async () =>{
    try{
        await sequelize.sync({alter:true});
        console.log("Database is connected Successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch(err){
        console.log("DB Connection Failed:",err)
    }
};

startServer();