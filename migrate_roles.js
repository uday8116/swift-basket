const mongoose = require('mongoose');
const User = require('./backend/models/User');
require('dotenv').config({ path: './backend/.env' });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Find admins without specific role set or just standard admins
        const result = await User.updateMany(
            { isAdmin: true },
            { $set: { role: 'superAdmin' } }
        );

        console.log('Migration Result:', result);

        const admins = await User.find({ role: 'superAdmin' });
        console.log('Current SuperAdmins:', admins.map(u => u.email));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrate();
