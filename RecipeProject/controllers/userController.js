const db = require('../db');

const User = db.users;

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        
        res.status(200).send(users);
    } catch (error) {
        res.status(500).json({
            status: 500, 
            message: 'Unable to get the users!', 
            error 
        });
    }
};

const getUser = async (req, res) => {
    try {
        const id = req.params.id;

        // Retrieve the user with the specified ID from the database
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find a user associated with the id!' 
            });
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the user!', 
            error 
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // Retrieve the user with the specified ID from the database
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find a user associated with the id!' 
            });
        }

        // Check if the authenticated user is the owner of the user being updated
        if (user.id !== userId) {
            return res.status(401).json({ 
                status: 401,
                message: 'Unauthorized to update the user!' 
            });
        }

        const { email } = req.body;

        // Check if the email is being changed, which is not allowed
        if (email !== undefined && email !== user.email) {
            return res.status(500).json({
                status: 500, 
                message: 'Email cannot be changed!' 
            });
        }

        await User.update(req.body, { where: { id } });

        res.status(200).json({ message: 'User updated successfully!' });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to update the user!', 
            error 
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // Retrieve the user with the specified ID from the database
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find the user associated with the id!' 
            });
        }

        // Check if the authenticated user is the owner of the user being deleted
        if (user.id !== userId) {
            return res.status(401).json({ 
                status: 401,
                message: 'Unauthorized to delete the user!' 
            });
        }

        // Delete the user from the database
        await User.destroy({ where: { id } });

        res.status(200).json({ message: 'User deleted successfully!' });
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to delete the user!', 
            error 
        });
    }
}

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser
}
