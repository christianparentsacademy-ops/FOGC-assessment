import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODULE_MAP = {
  "Gospel & Kingdom Understanding": {
    module: "Module 1",
    review: "Review the sections on the Gospel as the lens of reality, the Gospel of Grace, the Gospel of the Kingdom, Kingdom citizenship, and the transfer from darkness into light."
  },
  "Family as Foundation": {
    module: "Module 1",
    review: "Review the sections on family before temple, kings, and governments, family as the vehicle for spreading God's image, and the home as the foundation of Kingdom culture."
  },
  "Ministry of Parenthood": {
    module: "Module 2",
    review: "Review the office of parenthood, the image of God in male and female, the office of a mother, the office of a father, and the seed, soil, and Spirit framework."
  },
  "Discipleship in the Home": {
    module: "Module 3",
    review: "Review discipleship as citizenship training, generational transfer, technology as formation, identity as divine revelation, and modeling the Gospel in the home."
  }
};

const QUESTIONS = [
  { id:1, category:"Gospel & Kingdom Understanding", answer:1, theme:"Gospel as interpretive lens", concept:"The Gospel defines reality and shapes how everything else is interpreted." },
  { id:2, category:"Gospel & Kingdom Understanding", answer:1, theme:"Grace and Kingdom distinction", concept:"Grace reconciles sinners to God, while the Kingdom establishes governance, citizenship, and culture." },
  { id:3, category:"Gospel & Kingdom Understanding", answer:2, theme:"Light before sun", concept:"Light represents God's essence bringing order, clarity, life, and intention into chaos." },
  { id:4, category:"Gospel & Kingdom Understanding", answer:1, theme:"Transfer of kingdoms", concept:"Salvation is new birth and relocation from darkness into the Kingdom of light." },
  { id:5, category:"Gospel & Kingdom Understanding", answer:1, theme:"Kingdom as country", concept:"The Kingdom has a King, citizens, government, culture, language, law, and economy." },

  { id:6, category:"Family as Foundation", answer:1, theme:"Family before institutions", concept:"Family is God's foundational structure for spreading Kingdom culture and image." },
  { id:7, category:"Family as Foundation", answer:0, theme:"Family and culture", concept:"Family is the root environment where identity, culture, love, unity, and care are formed." },
  { id:8, category:"Family as Foundation", answer:1, theme:"Salvation through family", concept:"God entrusted the Savior to a household, showing family is sacred and foundational." },
  { id:9, category:"Family as Foundation", answer:2, theme:"Home as discipleship center", concept:"The family is the primary environment where Kingdom identity and culture are learned." },
  { id:10, category:"Family as Foundation", answer:1, theme:"Family language of Kingdom", concept:"God reveals Kingdom belonging through Father, Son, sons, daughters, brothers, sisters, co-heirs, and citizens." },

  { id:11, category:"Ministry of Parenthood", answer:1, theme:"Parenthood as office", concept:"Parenting carries divine jurisdiction, not merely biology or personal preference." },
  { id:12, category:"Ministry of Parenthood", answer:0, theme:"Male and female together", concept:"Both male and female reveal dimensions of God's nature in harmony without erasing distinction." },
  { id:13, category:"Ministry of Parenthood", answer:0, theme:"Tselah and shared humanity", concept:"Eve being taken from Adam's side emphasizes completion, shared humanity, and design." },
  { id:14, category:"Ministry of Parenthood", answer:1, theme:"Mother as soil of a waymaker", concept:"Mothers cultivate environments where identity, nurture, direction, and life can flourish." },
  { id:15, category:"Ministry of Parenthood", answer:1, theme:"Power of a mother's words", concept:"A mother's words can cultivate or damage the pathways of identity and destiny." },
  { id:16, category:"Ministry of Parenthood", answer:2, theme:"Father as source of identity", concept:"Fathers initiate identity, direction, and purpose through consistent formation." },
  { id:17, category:"Ministry of Parenthood", answer:0, theme:"Jacob and prophetic identity", concept:"Jacob's words over his sons show identity formation that echoes across generations." },
  { id:18, category:"Ministry of Parenthood", answer:0, theme:"Fatherhood beyond provision", concept:"Reducing fatherhood to finances disconnects fathers from discipleship and identity formation." },
  { id:19, category:"Ministry of Parenthood", answer:1, theme:"Seed, soil, and Spirit", concept:"Fatherhood, motherhood, and the Spirit cooperate in the formation of children and legacy." },
  { id:20, category:"Ministry of Parenthood", answer:1, theme:"Authority tied to jurisdiction", concept:"An office is a realm of authority tied to a God-given jurisdiction." },

  { id:21, category:"Discipleship in the Home", answer:0, theme:"Discipleship as relational formation", concept:"Kingdom culture must be walked out, modeled, embodied, and lived in relationship." },
  { id:22, category:"Discipleship in the Home", answer:1, theme:"Born again into Zion", concept:"New birth establishes spiritual citizenship in God's Kingdom, not merely religious affiliation." },
  { id:23, category:"Discipleship in the Home", answer:1, theme:"Church attendance without discipleship", concept:"Church attendance without discipleship produces people unclear on the Kingdom culture they represent." },
  { id:24, category:"Discipleship in the Home", answer:0, theme:"Citizenship training", concept:"Discipleship trains believers to live according to God's Kingdom culture, authority, and way." },
  { id:25, category:"Discipleship in the Home", answer:0, theme:"Generational transfer", concept:"Judges 2:10 reveals failure of relational transfer between generations, not failure of God." },
  { id:26, category:"Discipleship in the Home", answer:0, theme:"Technology as formation", concept:"Algorithms, screens, and influencers are actively forming worldview, identity, and habits." },
  { id:27, category:"Discipleship in the Home", answer:0, theme:"Restricting technology is not enough", concept:"Parents must present life with Jesus as joyful, beautiful, and satisfying, not only restrict technology." },
  { id:28, category:"Discipleship in the Home", answer:0, theme:"Identity as divine revelation", concept:"Identity originates from God's design and revelation, not cultural self-construction." },
  { id:29, category:"Discipleship in the Home", answer:0, theme:"Fear versus love", concept:"Fear may produce temporary control, but love, presence, prayer, and patience lead children toward truth." },
  { id:30, category:"Discipleship in the Home", answer:1, theme:"Modeling the Gospel", concept:"Children are formed more deeply by embodied patterns than verbal instruction alone." }
];

function getBand(score) {
  if (score >= 90) return "Foundation Established";
  if (score >= 75) return "Foundation Strengthening";
  if (score >= 60) return "Areas Needing Reinforcement";
  return "Re-engagement Recommended";
}

function scoreAssessment(answers) {
  const categoryData = {};
  const missed = [];
  const correct = [];

  for (const q of QUESTIONS) {
    categoryData[q.category] ||= { correct:0, total:0, missedThemes:[], masteredThemes:[] };
    categoryData[q.category].total += 1;
    const given = Number(answers[String(q.id)]);
    if (given === q.answer) {
      categoryData[q.category].correct += 1;
      categoryData[q.category].masteredThemes.push(q.theme);
      correct.push(q);
    } else {
      categoryData[q.category].missedThemes.push(q.theme);
      missed.push(q);
    }
  }

  const correctTotal = correct.length;
  const totalScore = Math.round((correctTotal / QUESTIONS.length) * 100);
  const categoryScores = {};
  const weakCategories = [];
  const strongCategories = [];

  for (const [category, data] of Object.entries(categoryData)) {
    const percent = Math.round((data.correct / data.total) * 100);
    categoryScores[category] = {
      score: percent,
      correct: data.correct,
      total: data.total,
      missedThemes: data.missedThemes,
      masteredThemes: data.masteredThemes,
      module: MODULE_MAP[category].module,
      review: MODULE_MAP[category].review
    };
    if (percent < 75) weakCategories.push({ category, score:percent, ...MODULE_MAP[category], missedThemes:data.missedThemes });
    if (percent >= 80) strongCategories.push({ category, score:percent, masteredThemes:data.masteredThemes });
  }

  return {
    totalScore,
    correctTotal,
    totalQuestions: QUESTIONS.length,
    resultBand: getBand(totalScore),
    categoryScores,
    weakCategories,
    strongCategories,
    missedConcepts: missed.map(q => ({ id:q.id, category:q.category, theme:q.theme, concept:q.concept })),
    masteredConcepts: correct.map(q => ({ category:q.category, theme:q.theme }))
  };
}

function fallbackInterpretation(scored, name) {
  const firstName = name || "Parent";
  const weak = scored.weakCategories.map(w => w.category);
  const strong = scored.strongCategories.map(s => s.category);
  const reviews = scored.weakCategories.length ? scored.weakCategories.map(w => `${w.module}: ${w.review}`) : ["No urgent module review is required. Revisit your notes prayerfully before moving into the next pathway step."];

  return {
    headline: `${scored.resultBand}: ${scored.totalScore}%`,
    summary: `${firstName}, your result shows ${scored.correctTotal} correct answers out of ${scored.totalQuestions}. This assessment is not measuring worth or calling. It is measuring how clearly the core revelation from the course has been retained and integrated. ${weak.length ? `The clearest reinforcement areas are ${weak.join(", ")}.` : "Your responses show strong overall comprehension across the course framework."}`,
    strengths: strong.length ? strong.map(s => `Strong grasp of ${s.category}, especially ${s.masteredThemes.slice(0,3).join(", ")}.`) : ["You completed the assessment and now have a clear map of what needs reinforcement before moving forward."],
    reinforcementAreas: scored.weakCategories.length ? scored.weakCategories.map(w => `${w.category}: revisit ${w.missedThemes.slice(0,4).join(", ")}.`) : ["No category fell below the reinforcement threshold."],
    recommendedReview: reviews,
    nextStep: scored.totalScore < 60 ? "Retake the course before continuing the Parent Pillar pathway. Focus especially on the modules connected to your lowest category scores." : scored.weakCategories.length ? "Review the recommended modules, then retake the assessment to confirm the foundation is stronger before moving forward." : "You are ready to continue to the next Parent Pillar step while keeping these foundations active in your home.",
    encouragement: "This is formation, not performance. Reinforcement is not failure. It is how foundations become strong enough to build on."
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { name = "", email = "", answers } = req.body || {};
    if (!answers || typeof answers !== "object") return res.status(400).json({ error: "Missing answers" });

    const scored = scoreAssessment(answers);
    let interpretation = fallbackInterpretation(scored, name);

    if (process.env.OPENAI_API_KEY) {
      try {
        const ai = await client.responses.create({
          model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
          input: [
            {
              role: "system",
              content: `You are the Hawkins House Parent Pillar Assessment Interpreter.

You must not create new doctrine. You interpret results according to the fixed course framework only.

Course framework:
- The Gospel is the lens through which reality is understood.
- Jesus preached the Gospel of the Kingdom.
- Salvation is rescue from darkness and relocation into the Kingdom of light.
- The Kingdom of God is a real country with King, citizens, culture, law, language, government, and economy.
- Family is the foundation of God's Kingdom and the primary place Kingdom culture is learned.
- Parenthood is a spiritual office and ministry.
- The office of a mother is the soil of a waymaker, cultivating life, nurture, direction, and atmosphere.
- The office of a father is the seed and source of identity, initiating direction, purpose, and formation.
- Discipleship is citizenship training in God's Kingdom.
- Discipleship begins at home.
- Technology is not neutral formation and must be submitted to God.
- Identity is divine revelation, not self-expression.
- Parents love children into truth through presence, patience, prayer, repentance, modeling, and the Gospel.

Write like Hawkins House: weighty, pastoral, intelligent, clear, encouraging, serious but not shaming.

Return JSON only with:
headline: string
summary: string, 120-180 words
strengths: array of 2-4 strings
reinforcementAreas: array of 2-5 strings
recommendedReview: array of 1-4 strings
nextStep: string, 60-100 words
encouragement: string, 40-80 words

Rules:
- Mention the score and result band.
- If a category is below 75%, explain what revelation needs reinforcement.
- If score is below 60, recommend retaking the course before moving forward.
- Do not say the parent failed.
- Do not use em dashes.
- Do not mention therapy, diagnosis, or child alignment.
- Do not invent scriptures or quote beyond the course framework.`
            },
            { role: "user", content: JSON.stringify({ name, email, ...scored }) }
          ],
          text: {
            format: {
              type: "json_schema",
              name: "assessment_interpretation",
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  headline: { type:"string" },
                  summary: { type:"string" },
                  strengths: { type:"array", items:{ type:"string" } },
                  reinforcementAreas: { type:"array", items:{ type:"string" } },
                  recommendedReview: { type:"array", items:{ type:"string" } },
                  nextStep: { type:"string" },
                  encouragement: { type:"string" }
                },
                required: ["headline","summary","strengths","reinforcementAreas","recommendedReview","nextStep","encouragement"]
              }
            }
          }
        });
        interpretation = JSON.parse(ai.output_text);
      } catch (err) {
        console.error("AI interpretation failed, using fallback", err);
      }
    }

    res.status(200).json({ name, email, ...scored, interpretation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Assessment could not be processed. Please try again." });
  }
}
