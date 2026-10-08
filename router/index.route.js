
const taskRoutes = require("./task.route");
const userRoutes = require("./user.route");

const authMiddleware = require("../middlewares/auth.middlewares");

module.exports = (app) => {
    // const version = "/test"
    app.use('/tasks',authMiddleware.requireAuth, taskRoutes);
    app.use('/user', userRoutes);
};