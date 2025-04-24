import mongoose from "mongoose";

const connectDB = (uri) => {
    mongoose.connect(uri, {
      dbName: "blogs",
    })
    .then((c) => console.log(`Database connected ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export default connectDB;