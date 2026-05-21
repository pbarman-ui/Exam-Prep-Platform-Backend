const { normalizeQuery } = require("../utils/normalizeQuery");
const questionService = require("../services/questionService");

async function listQuestions(req, res, next) {
  try {
    const { category, subCategory } = req.query;
    const normalized = normalizeQuery(category, subCategory);
    const rows = await questionService.findByCategory(
      normalized.category,
      normalized.subCategory,
    );
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function listSections(req, res, next) {
  try {
    const rows = await questionService.listSections();
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getQuestionById(req, res, next) {
  try {
    const { id } = req.params;
    const question = await questionService.findById(id);
    return res.json({
      instruction: question?.INSTRUCTION || "",
      question,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listQuestions, listSections, getQuestionById };
