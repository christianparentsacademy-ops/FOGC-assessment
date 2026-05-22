import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORY_MODULES = {
  "Gospel & Kingdom Understanding": "Module 1: Gospel and Kingdom Understanding",
  "Family as Foundation": "Module 1: Family as the Foundation of God’s Kingdom",
  "Ministry of Parenthood": "Module 2: The Ministry of Parenthood",
  "Discipleship in the Home": "Module 3: Discipleship in the Home"
};

const QUESTIONS = [
  { id: 1, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Gospel as lens" },
  { id: 2, category: "Gospel & Kingdom Understanding", answer: 2, theme: "Gospel of the Kingdom" },
  { id: 3, category: "Gospel & Kingdom Understanding", answer: 0, theme: "Transfer of kingdoms" },
  { id: 4, category: "Gospel & Kingdom Understanding", answer: 0, theme: "Kingdom as country" },
  { id: 5, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Gospel of Grace" },
  { id: 6, category: "Gospel & Kingdom Understanding", answer: 0, theme: "Gospel of Kingdom" },
  { id: 7, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Kingdom citizenship" },
  { id: 8, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Light and order" },
  { id: 9, category: "Family as Foundation", answer: 0, theme: "Family first" },
  { id: 10, category: "Family as Foundation", answer: 1, theme: "Image spreading" },
  { id: 11, category: "Family as Foundation", answer: 1, theme: "Why darkness targets family" },
  { id: 12, category: "Family as Foundation", answer: 0, theme: "Salvation through family" },
  { id: 13, category: "Family as Foundation", answer: 1, theme: "God as Father" },
  { id: 14, category: "Family as Foundation", answer: 1, theme: "Human family reflects God’s family" },
  { id: 15, category: "Ministry of Parenthood", answer: 1, theme: "Parenthood as ministry" },
  { id: 16, category: "Ministry of Parenthood", answer: 2, theme: "Male and female image" },
  { id: 17, category: "Ministry of Parenthood", answer: 1, theme: "Office and jurisdiction" },
  { id: 18, category: "Ministry of Parenthood", answer: 0, theme: "Office of mother" },
  { id: 19, category: "Ministry of Parenthood", answer: 1, theme: "Mother’s words" },
  { id: 20, category: "Ministry of Parenthood", answer: 0, theme: "Office of father" },
  { id: 21, category: "Ministry of Parenthood", answer: 1, theme: "Naming and identity" },
  { id: 22, category: "Ministry of Parenthood", answer: 0, theme: "Seed and soil framework" },
  { id: 23, category: "Discipleship in the Home", answer: 2, theme: "Discipleship as citizenship training" },
  { id: 24, category: "Discipleship in the Home", answer: 0, theme: "Discipleship begins at home" },
  { id: 25, category: "Discipleship in the Home", answer: 1, theme: "Generational transfer" },
  { id: 26, category: "Discipleship in the Home", answer: 1, theme: "Technology submitted to God" },
  { id: 27, category: "Discipleship in the Home", answer: 0, theme: "Algorithms as formation" },
  { id: 28, category: "Discipleship in the Home", answer: 1, theme: "False identity" },
  { id: 29, category: "Discipleship in the Home", answer: 2, theme: "Love into truth" },
  { id: 30, category: "Discipleship in the Home", answer: 0, theme: "Modeling the Gospel" }
];

function getBand(score) {
  if (score >= 90) return "Foundation Established";
  if (score >= 75) return "Foundation Strengthening";
  if (score >= 60) return "Areas Needing Reinforcement";
  return "Re-engagement Recommended";
}

function scoreAssessment(answers) {
  const categoryData = {};
  for (const q of QUESTIONS) {
    if (!categoryData[q.category]) categoryData[q.category] = { correct: 0, total: 0, missedThemes: [] };
    categoryData[q.category].total += 1;
    if (Number(answers[String(q.id)]) === q.answer) categoryData[q.category].correct += 1;
    else categoryData[q.category].missedThemes.push(q.theme);
  }

  const correctTotal = Object.values(categoryData).reduce((sum, c) => sum + c.correct, 0);
  const totalScore = Math.round((correctTotal / QUESTIONS.length) * 100);
  const categoryScores = {};
  const weakCategories = [];
  const incorrectThemes = [];

  for (const [category, data] of Object.entries(categoryData)) {
    const percent = Math.round((data.correct / data.total) * 100);
    categoryScores[category] = percent;
    if (percent < 70) weakCategories.push({ category, score: percent, review: CATEGORY_MODULES[category] });
    incorrectThemes.push(...data.missedThemes);
  }

  return {
    totalScore,
    resultBand: getBand(totalScore),
    categoryScores,
    weakCategories,
    incorrectThemes: [...new Set(incorrectThemes)]
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name = "", email = "", answers } = req.body;
    if (!answers || typeof answers !== "object") return res.status(400).json({ error: "Missing answers" });

    const scored = scoreAssessment(answers);

    const aiResponse = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `You are the Hawkins House Assessment Interpreter.

You do not create new doctrine. You only interpret assessment results according to the fixed course framework provided.

Course framework:
1. The Gospel is the lens through which all reality is understood.
2. Jesus preached the Gospel of the Kingdom.
3. Salvation is not only rescue from darkness, but relocation into the Kingdom of light.
4. The Kingdom of God is a real country with a real King, citizens, government, culture, language, law, and economy.
5. Family is the foundation of God’s Kingdom and the primary environment where Kingdom culture is learned.
6. Parenthood is ministry.
7. The office of a mother is the soil of a waymaker.
8. The office of a father is the seed and source of identity.
9. Discipleship is citizenship training in God’s Kingdom.
10. Discipleship begins at home.
11. Technology is a tool that must be submitted to God.
12. Identity is not self-expression, but divine revelation.
13. Parents must love children into truth through presence, patience, prayer, and the lived Gospel.

Return JSON only with: headline, summary, strengths, reinforcementAreas, recommendedReview, nextStep, encouragement.

Do not shame the parent. Do not introduce doctrines outside the course. Keep the full response under 350 words.`
        },
        { role: "user", content: JSON.stringify({ parentName: name, parentEmail: email, ...scored }) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "assessment_result",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              headline: { type: "string" },
              summary: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              reinforcementAreas: { type: "array", items: { type: "string" } },
              recommendedReview: { type: "array", items: { type: "string" } },
              nextStep: { type: "string" },
              encouragement: { type: "string" }
            },
            required: ["headline", "summary", "strengths", "reinforcementAreas", "recommendedReview", "nextStep", "encouragement"]
          }
        }
      }
    });

    const interpretation = JSON.parse(aiResponse.output_text);
    return res.status(200).json({ name, email, ...scored, interpretation });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Assessment could not be processed. Please try again." });
  }
}
