// defining the dependencies
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/user-router.js');
const auth = require('./middleware/auth.js');
require('./db/mongoose');

const port = process.env.PORT || 3000;
const app = express();



app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload());
app.use(userRouter);



// starting the application
app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`listening on ${port}`);
});
