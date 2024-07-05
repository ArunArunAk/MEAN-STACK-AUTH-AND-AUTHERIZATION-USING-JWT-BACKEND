

const Role = require("../models/role.model");

const createRole=async (req, res, next) => {
    try {
        if (req.body.role && req.body.role !== '') {
            const newRole = new Role(req.body);
            await newRole.save();
            res.status(201).send("Role created successfully");
        } else {
            res.status(400).send("Bad Request");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const updateRole=async (req, res, next) => {

    const roleId = req.params.id;
    try {
        const updatedRole = await Role.findByIdAndUpdate(roleId, req.body, { new: true });
        if (!updatedRole) {
            return res.status(404).send("Role not found");
        }
        res.status(200).send("Role updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find();
        res.status(200).send(roles);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

const deleteRole = async (req, res, next) => {
    const roleId = req.params.id;
    try {
        const deletedRole = await Role.findByIdAndDelete(roleId);
        if (!deletedRole) {
            return res.status(404).send("Role not found");
        }
        res.status(200).send("Role deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = {
    createRole,
    updateRole,
    getAllRoles,
    deleteRole
};

