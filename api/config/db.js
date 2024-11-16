import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect("mongodb+srv://mishraarun136:rjHZmd7Zo6plgDNQ@cluster0.ltolv.mongodb.net/tinder_db?retryWrites=true&w=majority");
        console.log(`MONGODB Connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log("Error connecting to MONGODB: ",error);
        process.exit(1);
    }
}