const Connection = require("../db/Connection");

exports.getAllTemplates = async () => {
  return await Connection(
    "SELECT id, name, category, message FROM sms_templates"
  );
};

exports.getTemplateById = async (id) => {
  const result = await Connection("SELECT * FROM sms_templates WHERE id = ?", [
    id,
  ]);
  return result[0];
};

exports.createTemplate = async (name, category, message) => {
  return await Connection(
    "INSERT INTO sms_templates (name, category, message) VALUES (?, ?, ?)",
    [name, category, message]
  );
};

exports.updateTemplate = async (id, name, category, message) => {
  return await Connection(
    "UPDATE sms_templates SET name = ?, category = ?, message = ? WHERE id = ?",
    [name, category, message, id]
  );
};

exports.deleteTemplate = async (id) => {
  return await Connection("DELETE FROM sms_templates WHERE id = ?", [id]);
};
