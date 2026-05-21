// Maps incoming category/subCategory variants to the canonical values stored in Snowflake.
function normalizeQuery(category, subCategory) {
  let mappedCat = (category || "").trim();
  let mappedSub = (subCategory || "").trim().replace(/-/g, " ");

  const lowerCat = mappedCat.toLowerCase();
  const lowerSub = mappedSub.toLowerCase();

  if (lowerCat === "speaking") {
    if (lowerSub === "re tell lecture" || lowerSub === "retell lecture") {
      mappedSub = "Retell Lecture";
    }
  } else if (lowerCat === "writing") {
    if (lowerSub === "essay" || lowerSub === "write essay") {
      mappedSub = "Write Essay";
    } else if (lowerSub === "summarize written text" || lowerSub === "summarize written text (core)") {
      mappedSub = "Summarize Written Text";
    }
  } else if (lowerCat === "reading") {
    if (lowerSub === "r/w fill in blanks" || lowerSub === "fill in the blanks (dropdown)" || lowerSub === "reading & writing: fill in the blanks") {
      mappedSub = "Fill in the Blanks (Dropdown)";
    } else if (lowerSub === "fill in blanks" || lowerSub === "fill in the blanks (drag and drop)" || lowerSub === "reading: fill in the blanks") {
      mappedSub = "Fill in the Blanks (Drag and Drop)";
    } else if (lowerSub === "re order paragraphs" || lowerSub === "reorder paragraph" || lowerSub === "reorder paragraphs") {
      mappedSub = "Reorder Paragraph";
    } else if (lowerSub === "multiple answers" || lowerSub === "multiple choice, multiple answers") {
      mappedSub = "Multiple Choice, Multiple Answers";
    } else if (lowerSub === "single answer" || lowerSub === "multiple choice, single answer") {
      mappedSub = "Multiple Choice, Single Answer";
    }
  } else if (lowerCat === "listening") {
    if (lowerSub === "answer short question") {
      // Answer Short Question is stored under Speaking in the DB
      mappedCat = "Speaking";
      mappedSub = "Answer Short Question";
    } else if (lowerSub === "summarize spoken text" || lowerSub === "summarize spoken text (core)") {
      mappedSub = "Summarize Spoken Text";
    } else if (lowerSub === "multiple answers" || lowerSub === "multiple choice, multiple answers") {
      mappedSub = "Multiple Choice, Multiple Answers";
    } else if (lowerSub === "fill in blanks" || lowerSub === "fill in the blanks (type in)") {
      mappedSub = "Fill in the Blanks (Type In)";
    } else if (lowerSub === "single answer" || lowerSub === "multiple choice, single answer") {
      mappedSub = "Multiple Choice, Single Answer";
    } else if (lowerSub === "write from dictation") {
      mappedSub = "Write from Dictation";
    }
  }

  return { category: mappedCat, subCategory: mappedSub };
}

module.exports = { normalizeQuery };
