import configModel from "../models/configModel.js";

const getConfig = async (req, res) => {
    try {
        const configs = await configModel.find({});
        const configMap = {};
        configs.forEach(c => { configMap[c.key] = c.value });
        res.json({ success: true, data: configMap });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching config" });
    }
}

const updateConfig = async (req, res) => {
    try {
        const { key, value } = req.body;
        await configModel.findOneAndUpdate({ key }, { value }, { upsert: true });
        res.json({ success: true, message: "Config Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating config" });
    }
}

export { getConfig, updateConfig };
