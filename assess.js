
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const QUESTIONS = [
  { id: 1, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Gospel as the lens of reality" },
  { id: 2, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Grace and Kingdom distinction" },
  { id: 3, category: "Gospel & Kingdom Understanding", answer: 2, theme: "Light as God's ordering essence" },
  { id: 4, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Salvation as kingdom transfer" },
  { id: 5, category: "Gospel & Kingdom Understanding", answer: 1, theme: "Kingdom as country and citizenship" },

  { id: 6, category: "Family as Foundation", answer: 1, theme: "Family as God's foundational structure" },
  { id: 7, category: "Family as Foundation", answer: 0, theme: "Family as formation environment" },
  { id: 8, category: "Family as Foundation", answer: 1, theme: "God entrusted Jesus to family" },
  { id: 9, category: "Family as Foundation", answer: 2, theme: "Home as primary Kingdom environment" },

  { id: 10, category: "Ministry of Parenthood", answer: 1, theme: "Parenthood as spiritual office" },
  { id: 11, category: "Ministry of Parenthood", answer: 1, theme: "Male and female together reflecting God's image" },
  { id: 12, category: "Ministry of Parenthood", answer: 0, theme: "Tsela as side and shared humanity" },
  { id: 13, category: "Ministry of Parenthood", answer: 1, theme: "Mother as soil of a waymaker" },
  { id: 14, category: "Ministry of Parenthood", answer: 1, theme: "Mother's words shaping identity pathways" },
  { id: 15, category: "Ministry of Parenthood", answer: 2, theme: "Father as seed and source of identity" },
  { id: 16, category: "Ministry of Parenthood", answer: 0, theme: "Jacob and generational identity formation" },
  { id: 17, category: "Ministry of Parenthood", answer: 0, theme: "Fatherhood beyond financial provision" },
  { id: 18, category: "Ministry of Parenthood", answer: 1, theme: "Seed, soil, and Spirit cooperating in formation" },

  { id: 19, category: "Discipleship in the Home", answer: 0, theme: "Discipleship as embodied Kingdom culture" },
  { id: 20, category: "Discipleship in the Home", answer: 1, theme: "Born again into Kingdom citizenship" },
  { id: 21, category: "Discipleship in the Home", answer: 1, theme: "Church attendance without discipleship" },
  { id: 22, category: "Discipleship in the Home", answer: 0, theme: "Citizenship training" },
  { id: 23, category: "Discipleship in the Home", answer: 1, theme: "Judges 2:10 and transfer failure" },
  { id: 24, category: "Discipleship in the Home", answer: 0, theme: "Generational bridge" },
  { id: 25, category: "Discipleship in the Home", answer: 0, theme: "Algorithms as formation" },
  { id: 26, category: "Discipleship in the Home", answer: 0, theme: "Technology limits versus joyful vision of Jesus" },
  { id: 27, category: "Discipleship in the Home", answer: 0, theme: "Identity as divine revelation" },
  { id: 28, category: "Discipleship in the Home", answer: 0, theme: "Fear-based parenting fractures identity" },
  { id: 29, category: "Discipleship in the Home", answer: 0, theme: "Modeling over instruction alone" },
  { id: 30, category: "Discipleship in the Home", answer: 1, theme: "Home as primary environment of Kingdom discipleship" }
];

const MODULE_MAP = {
  "Gospel & Kingdom Understanding": "Module 1: Gospel, Kingdom, light, salvation, citizenship, and God’s Country",
  "Family as Foundation": "Module 1: Family as the foundation of God’s Kingdom",
  "Ministry of Parenthood": "Module 2: The ministry of parenthood, the office of mother, the office of father, seed and soil",
  "Discipleship in the Home": "Module 3: Discipleship, generational transfer, technology, identity, and Gospel-centered formation"
};

function getBand(score) {
  if (score >= 90) return "Foundation Established";
  if (score >= 75) return "Foundation Strengthening";
  if (score >= 60) return "Areas Needing Reinforcement";
  return "Re-engagement Recommended";
}

function scoreAssessment(answers) {
  const categories = {};

  for (const q of QUESTIONS) {
    if (!categories[q.category]) {
      categories[q.category] = {
        correct: 0,
        total: 0,
        missedThemes: [],
        masteredThemes: []
      };
    }

    categories[q.category].total += 1;

    const chosen = Number(answers[String(q.id)]);
    if (chosen === q.answer) {
      categories[q.category].correct += 1;
      categories[q.category].masteredThemes.push(q.theme);
    } else {
      categories[q.category].missedThemes.push(q.theme);
    }
  }

  const totalCorrect = Object.values(categories).reduce((sum, c) => sum + c.correct, 0);
  const totalScore = Math.round((totalCorrect / QUESTIONS.length) * 100);

  const categoryScores = {};
  const weakCategories = [];
  const strongCategories = [];
  const missedThemes = [];
  const masteredThemes = [];

  for (const [category, data] of Object.entries(categories)) {
    const percent = Math.round((data.correct / data.total) * 100);
    categoryScores[category] = percent;

    if (percent < 70) {
      weakCategories.push({
        category,
        score: percent,
        module: MODULE_MAP[category],
        missedThemes: data.missedThemes
      });
    }

    if (percent >= 80) {
      strongCategories.push({
        category,
        score: percent,
        masteredThemes: data.masteredThemes
      });
    }

    missedThemes.push(...data.missedThemes);
    masteredThemes.push(...data.masteredThemes);
  }

  return {
    totalScore,
    resultBand: getBand(totalScore),
    categoryScores,
    weakCategories,
    strongCategories,
    missedThemes: [...new Set(missedThemes)],
    masteredThemes: [...new Set(masteredThemes)]
  };
}

function fallbackInterpretation(scored, name) {
  const weakNames = scored.weakCategories.map(w => w.category);
  const strongNames = scored.strongCategories.map(s => s.category);

  return {
    headline: scored.resultBand,
    summary: `${name ? name + ", " : ""}your assessment has been completed. Your score shows ${scored.resultBand.toLowerCase()}. This means the course revelation is ${scored.totalScore >= 75 ? "taking root, but the category breakdown should still guide your next review." : "not yet settled deeply enough to move forward without review."}`,
    strengths: strongNames.length
      ? strongNames.map(c => `You showed strong comprehension in ${c}.`)
      : ["Your responses show that some key ideas are beginning to form, but no category reached the strong mastery threshold yet."],
    reinforcementAreas: weakNames.length
      ? weakNames.map(c => `${c} needs reinforcement before continuing deeper into the Parent Pillar pathway.`)
      : ["No category fell below the reinforcement threshold, though continued review will help deepen retention."],
    recommendedReview: scored.weakCategories.length
      ? scored.weakCategories.map(w => `${w.module}. Pay close attention to: ${w.missedThemes.join(", ")}.`)
      : ["Review your notes from each module and continue into the next step of the pathway."],
    nextStep: scored.totalScore < 60
      ? "Retake the course before moving forward. The foundation needs to be re-engaged with prayer, attention, and reflection."
      : scored.totalScore < 75
        ? "Review the recommended modules, then retake the assessment before moving forward."
        : "You may continue forward, but revisit the recommended areas so your foundation remains strong.",
    encouragement: "This assessment is not a condemnation. It is a mirror. The goal is not to prove perfection, but to identify where revelation has become established and where it still needs to be strengthened."
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name = "", email = "", answers } = req.body || {};

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Missing answers" });
    }

    const scored = scoreAssessment(answers);

    let interpretation;

    if (!process.env.OPENAI_API_KEY) {
      interpretation = fallbackInterpretation(scored, name);
    } else {
      try {
        const response = await client.responses.create({
          model: "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: `You are the Hawkins House Parent Pillar Assessment Interpreter.

You do not invent doctrine. You interpret assessment results only according to this course framework:

1. The Gospel is the lens through which all reality is understood.
2. Jesus preached the Gospel of the Kingdom.
3. The Gospel of Grace answers how sinners are reconciled to God. The Gospel of the Kingdom reveals God's country, government, culture, and reign.
4. Salvation is not only rescue from darkness, but relocation into the Kingdom of light.
5. The Kingdom of God is a real country with a real King, citizens, government, culture, language, law, and economy.
6. Family is the foundation of God's Kingdom and the primary environment where Kingdom culture is learned and lived.
7. Parenthood is ministry.
8. The office of a mother is the soil of a waymaker, forming environment, nurture, direction, and life through presence and words.
9. The office of a father is the seed and source of identity, speaking direction, identity, and purpose.
10. Discipleship is citizenship training in God's Kingdom.
11. Discipleship begins at home.
12. Technology is a tool that must be submitted to God because screens, algorithms, influencers, and culture are forming children.
13. Identity is not self-expression. Identity is divine revelation.
14. Parents must love children into truth through presence, patience, prayer, repentance, modeling, and the lived Gospel.

Your result must feel like a curated spiritual diagnostic, not a school quiz grade.

Return JSON only with this shape:
{
  "headline": "",
  "summary": "",
  "scoreMeaning": "",
  "strengths": [],
  "reinforcementAreas": [],
  "recommendedReview": [],
  "nextStep": "",
  "encouragement": ""
}

Rules:
- Be warm, clear, pastoral, intelligent, and serious.
- Do not shame the parent.
- Do not flatter falsely.
- Do not mention therapy or child assessment.
- Do not introduce outside doctrine.
- Use the category scores and missed concepts to be specific.
- If the total score is below 60, recommend retaking the course before moving forward.
- If a category is below 70, recommend reviewing its module.
- Under 500 words total.`
            },
            {
              role: "user",
              content: JSON.stringify({
                parentName: name,
                parentEmail: email,
                totalScore: scored.totalScore,
                resultBand: scored.resultBand,
                categoryScores: scored.categoryScores,
                strongCategories: scored.strongCategories,
                weakCategories: scored.weakCategories,
                missedConcepts: scored.missedThemes,
                masteredConcepts: scored.masteredThemes
              })
            }
          ],
          text: {
            format: {
              type: "json_schema",
              name: "hawkins_assessment_result",
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  headline: { type: "string" },
                  summary: { type: "string" },
                  scoreMeaning: { type: "string" },
                  strengths: { type: "array", items: { type: "string" } },
                  reinforcementAreas: { type: "array", items: { type: "string" } },
                  recommendedReview: { type: "array", items: { type: "string" } },
                  nextStep: { type: "string" },
                  encouragement: { type: "string" }
                },
                required: ["headline", "summary", "scoreMeaning", "strengths", "reinforcementAreas", "recommendedReview", "nextStep", "encouragement"]
              }
            }
          }
        });

        interpretation = JSON.parse(response.output_text);
      } catch (aiError) {
        console.error("AI interpretation failed:", aiError);
        interpretation = fallbackInterpretation(scored, name);
      }
    }

    return res.status(200).json({
      name,
      email,
      ...scored,
      interpretation
    });
  } catch (error) {
    console.error("Assessment processing failed:", error);
    return res.status(200).json({
      ...scoreAssessment(req.body?.answers || {}),
      interpretation: fallbackInterpretation(scoreAssessment(req.body?.answers || {}), req.body?.name || "")
    });
  }
}
