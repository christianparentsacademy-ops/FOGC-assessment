
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const QUESTIONS = [
{id:1,category:"Gospel & Kingdom Understanding",answer:1,theme:"Gospel as the lens of reality",question:"According to the course, why is an inaccurate understanding of the Gospel dangerous for family discipleship?",options:["Because it creates denominational differences","Because the Gospel defines reality itself and shapes how everything else is interpreted","Because children dislike theological conversations","Because morality alone cannot build strong homes"]},
{id:2,category:"Gospel & Kingdom Understanding",answer:1,theme:"Grace and Kingdom distinction",question:"Why does the course distinguish between the Gospel of Grace and the Gospel of the Kingdom?",options:["To separate Old and New Testament believers","To show that forgiveness and Kingdom governance are related but not identical realities","To argue against salvation by grace","To establish denominational hierarchy"]},
{id:3,category:"Gospel & Kingdom Understanding",answer:2,theme:"Light as God's ordering essence",question:"What theological purpose did the course assign to light in Genesis before the creation of the sun?",options:["Light represented intelligence emerging naturally","Light symbolized human enlightenment","Light revealed God's essence bringing order and life into chaos","Light represented future scientific discovery"]},
{id:4,category:"Gospel & Kingdom Understanding",answer:1,theme:"Salvation as kingdom transfer",question:"According to the course, salvation should primarily be understood as:",options:["A private religious decision","A transfer from one kingdom and nature into another","A moral improvement process","A future heavenly guarantee only"]},
{id:5,category:"Gospel & Kingdom Understanding",answer:1,theme:"Kingdom as country and citizenship",question:"Why does the course repeatedly describe the Kingdom of God as a real country?",options:["To create political analogies","To emphasize structure, citizenship, culture, law, and belonging","To replace the concept of heaven","To prioritize institutions over relationships"]},
{id:6,category:"Family as Foundation",answer:1,theme:"Family as God's foundational structure",question:"What was the course attempting to communicate by showing that God established family before governments, kings, or temples?",options:["That religious systems are unnecessary","That family is God's foundational structure for spreading Kingdom culture","That politics are inherently evil","That civilization developed accidentally"]},
{id:7,category:"Family as Foundation",answer:0,theme:"Family as formation environment",question:"Why did the course connect societal collapse to fractures within family structures?",options:["Because Scripture presents family as the root environment where identity and culture are formed","Because governments control parenting","Because economics determine morality","Because churches cannot disciple children"]},
{id:8,category:"Family as Foundation",answer:1,theme:"God entrusted Jesus to family",question:"What was the deeper theological significance of Jesus being entrusted to Mary and Joseph?",options:["It fulfilled Roman prophecy","God demonstrated that family is sacred enough to steward the Savior Himself","Jesus needed protection from culture","Marriage guarantees righteousness"]},
{id:9,category:"Family as Foundation",answer:2,theme:"Home as primary Kingdom environment",question:"According to the course, why is discipleship in the home not optional?",options:["Because churches are ineffective","Because parents are morally superior","Because family is the primary environment where Kingdom identity is learned","Because education systems cannot teach values"]},
{id:10,category:"Ministry of Parenthood",answer:1,theme:"Parenthood as spiritual office",question:"What was the course attempting to restore by describing parenthood as a spiritual office rather than merely a role?",options:["Traditional social expectations","The understanding that parenting carries divine jurisdiction and responsibility","Religious superiority","Gender competition"]},
{id:11,category:"Ministry of Parenthood",answer:1,theme:"Male and female together reflecting God's image",question:"Why did the course emphasize that God's image is revealed through male and female together?",options:["To eliminate distinctions between men and women","To demonstrate that both reveal dimensions of God's nature in harmony","To prioritize marriage over discipleship","To redefine biblical authority"]},
{id:12,category:"Ministry of Parenthood",answer:0,theme:"Tsela as side and shared humanity",question:"What was the significance of the Hebrew concept of tsêlâʻ being translated as 'side' instead of merely 'rib'?",options:["It symbolized equality, completion, and shared humanity","It rejected biological distinctions","It argued against leadership","It minimized fatherhood"]},
{id:13,category:"Ministry of Parenthood",answer:1,theme:"Mother as soil of a waymaker",question:"Why did the course describe the office of a mother as 'the soil of a waymaker'?",options:["Because motherhood is passive support","Because mothers create environments where identity, nurture, and direction flourish","Because fathers are unnecessary","Because women are naturally more emotional"]},
{id:14,category:"Ministry of Parenthood",answer:1,theme:"Mother's words shaping identity pathways",question:"What danger did the course associate with destructive speech from mothers?",options:["Children become less disciplined","Words can dismantle identity pathways and shape future emotional realities","Children reject education","Families lose financial stability"]},
{id:15,category:"Ministry of Parenthood",answer:2,theme:"Father as seed and source of identity",question:"What central responsibility did the course associate with the office of a father?",options:["Maintaining emotional distance","Providing financial resources only","Initiating identity, direction, and purpose through consistent formation","Protecting cultural traditions"]},
{id:16,category:"Ministry of Parenthood",answer:0,theme:"Jacob and generational identity formation",question:"Why did the course repeatedly reference Jacob speaking over his sons?",options:["To demonstrate prophetic identity formation across generations","To establish tribal politics","To prioritize favoritism","To encourage emotional discipline"]},
{id:17,category:"Ministry of Parenthood",answer:0,theme:"Fatherhood beyond financial provision",question:"According to the course, why is reducing fatherhood to financial provision spiritually dangerous?",options:["Because it disconnects fathers from identity formation and discipleship","Because finances are unnecessary","Because mothers should lead homes alone","Because success is sinful"]},
{id:18,category:"Ministry of Parenthood",answer:1,theme:"Seed, soil, and Spirit cooperating in formation",question:"What was the purpose of the seed, soil, and rain framework?",options:["To romanticize parenting","To show how fatherhood, motherhood, and the Spirit cooperate in formation","To prioritize biology over discipleship","To reject structure"]},
{id:19,category:"Discipleship in the Home",answer:0,theme:"Discipleship as embodied Kingdom culture",question:"According to the course, why is discipleship best understood relationally rather than informationally?",options:["Because Kingdom culture must be modeled, walked with, and embodied","Because information has no value","Because children dislike structure","Because discipleship only happens emotionally"]},
{id:20,category:"Discipleship in the Home",answer:1,theme:"Born again into Kingdom citizenship",question:"Why did the course ask, 'Where were you born when you were born again?'",options:["To challenge denominational assumptions","To establish spiritual citizenship within the Kingdom of God","To reject earthly responsibility","To encourage mystical thinking"]},
{id:21,category:"Discipleship in the Home",answer:1,theme:"Church attendance without discipleship",question:"What problem arises when church attendance exists without true discipleship?",options:["People become overly emotional","Citizens lose understanding of the Kingdom culture they represent","Families become isolated","Children avoid leadership"]},
{id:22,category:"Discipleship in the Home",answer:0,theme:"Citizenship training",question:"Why did the course describe discipleship as citizenship training?",options:["Because believers are learning how to live according to the culture and authority of God's Kingdom","Because Christianity is political","Because discipline matters more than love","Because religion requires structure"]},
{id:23,category:"Discipleship in the Home",answer:1,theme:"Judges 2:10 and transfer failure",question:"What did Judges 2:10 reveal about generational failure?",options:["That God abandoned Israel","That truth stopped being relationally transferred between generations","That technology caused spiritual collapse","That worship practices disappeared"]},
{id:24,category:"Discipleship in the Home",answer:0,theme:"Generational bridge",question:"Why did the course identify the space between generations as spiritually strategic?",options:["Because identity, truth, and culture must be intentionally transferred","Because younger generations reject leadership automatically","Because parents should control children","Because traditions prevent innovation"]},
{id:25,category:"Discipleship in the Home",answer:0,theme:"Algorithms as formation",question:"What was the deeper concern behind the statement 'algorithms have become the new rabbis'?",options:["Technology is forming identity and worldview faster than intentional discipleship","Artificial intelligence is evil","Children should avoid the internet completely","Churches should ban social media"]},
{id:26,category:"Discipleship in the Home",answer:0,theme:"Technology limits versus joyful vision of Jesus",question:"According to the course, why is merely restricting technology insufficient?",options:["Because children primarily need a compelling vision of life with Jesus, not only limitation","Because technology is harmless","Because discipline creates rebellion","Because children naturally mature spiritually"]},
{id:27,category:"Discipleship in the Home",answer:0,theme:"Identity as divine revelation",question:"Why did the course argue that identity is divine revelation rather than self-expression?",options:["Because identity originates from God's design rather than cultural construction","Because personality is irrelevant","Because emotions are deceptive","Because achievement determines value"]},
{id:28,category:"Discipleship in the Home",answer:0,theme:"Fear-based parenting fractures identity",question:"What danger did the course associate with parenting primarily through fear?",options:["Fear creates temporary obedience but fractures identity and relationship","Fear weakens education","Fear eliminates ambition","Fear prevents discipline entirely"]},
{id:29,category:"Discipleship in the Home",answer:0,theme:"Modeling over instruction alone",question:"Why did the course repeatedly emphasize modeling over merely instructing?",options:["Because children are formed more deeply by embodied patterns than verbal correction alone","Because teaching lacks value","Because structure creates legalism","Because children resist authority"]},
{id:30,category:"Discipleship in the Home",answer:1,theme:"Home as primary environment of Kingdom discipleship",question:"What was the overarching purpose of the entire course framework?",options:["To produce religious performance","To restore the home as the primary environment of Kingdom discipleship and formation","To increase church attendance","To establish educational reform"]}
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
    if (!categories[q.category]) categories[q.category] = { correct: 0, total: 0, missedThemes: [], masteredThemes: [] };
    categories[q.category].total += 1;
    const chosen = Number(answers[String(q.id)]);
    if (chosen === q.answer) {
      categories[q.category].correct += 1;
      categories[q.category].masteredThemes.push(q.theme);
    } else {
      categories[q.category].missedThemes.push(q.theme);
    }
  }
  const totalCorrect = Object.values(categories).reduce((sum,c)=>sum+c.correct,0);
  const totalScore = Math.round((totalCorrect / QUESTIONS.length) * 100);
  const categoryScores = {};
  const weakCategories = [];
  const strongCategories = [];
  const missedThemes = [];
  const masteredThemes = [];
  for (const [category, data] of Object.entries(categories)) {
    const percent = Math.round((data.correct / data.total) * 100);
    categoryScores[category] = percent;
    if (percent < 70) weakCategories.push({ category, score: percent, module: MODULE_MAP[category], missedThemes: data.missedThemes });
    if (percent >= 80) strongCategories.push({ category, score: percent, masteredThemes: data.masteredThemes });
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
    summary: `${name ? name + ", " : ""}your responses show where the course revelation has settled and where it still needs reinforcement. This is not a pass or fail moment. It is a diagnostic mirror for your Parent Pillar foundation.`,
    scoreMeaning: `A score of ${scored.totalScore}% places you in the “${scored.resultBand}” range. ${scored.totalScore >= 75 ? "That means the core framework is taking root, but the category breakdown should still guide your next review." : "That means the foundation should be revisited before you move forward in the pathway."}`,
    strengths: strongNames.length ? strongNames.map(c => `You showed strong comprehension in ${c}, which means this portion of the framework is beginning to become clear and usable.`) : ["No category reached the strong mastery threshold yet. That does not mean nothing was received, but it does mean the framework should be revisited carefully."],
    reinforcementAreas: weakNames.length ? weakNames.map(c => `${c} needs reinforcement. This category appears to contain concepts that were heard but may not yet be fully integrated.`) : ["No category fell below the reinforcement threshold. Continue reviewing your notes so the revelation becomes more than information."],
    recommendedReview: scored.weakCategories.length ? scored.weakCategories.map(w => `${w.module}. Pay close attention to: ${w.missedThemes.join(", ")}.`) : ["Review all modules lightly, then continue to the next step in the Parent Pillar pathway."],
    nextStep: scored.totalScore < 60 ? "Retake the course before moving forward. The foundation needs to be re-engaged with prayer, attention, and reflection." : scored.totalScore < 75 ? "Review the recommended modules, then retake the assessment before moving forward." : "You may continue forward, but revisit the recommended areas so your foundation remains strong.",
    encouragement: "The purpose of this assessment is formation, not shame. The goal is to identify what has become established and what still needs to be strengthened."
  };
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = req.body || {};
  const answers = body.answers || {};
  const name = body.name || "";
  const email = body.email || "";
  const scored = scoreAssessment(answers);

  let interpretation = fallbackInterpretation(scored, name);

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: `You are the Hawkins House Parent Pillar Assessment Interpreter. Do not invent doctrine. Interpret only according to this course framework: Gospel as lens of reality; Jesus preached the Gospel of the Kingdom; grace reconciles sinners to God; Kingdom reveals God's country and government; salvation is transfer from darkness into light; family is the foundation of God's Kingdom; parenthood is ministry; mother is soil of a waymaker; father is seed and source of identity; discipleship is citizenship training; discipleship begins at home; technology must be submitted to God; identity is divine revelation; parents love children into truth through presence, patience, prayer, repentance, modeling, and the lived Gospel. Return JSON only with headline, summary, scoreMeaning, strengths, reinforcementAreas, recommendedReview, nextStep, encouragement. Make it feel like a curated spiritual diagnostic, not a school quiz grade. Be warm, clear, pastoral, intelligent, and serious. Do not shame. Do not flatter falsely. Do not mention therapy. Use category scores and missed concepts specifically. Under 500 words.`
          },
          { role: "user", content: JSON.stringify({ parentName:name, parentEmail:email, ...scored }) }
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
              required: ["headline","summary","scoreMeaning","strengths","reinforcementAreas","recommendedReview","nextStep","encouragement"]
            }
          }
        }
      });
      interpretation = JSON.parse(response.output_text);
    } catch (e) {
      console.error("OpenAI failed, using fallback:", e);
    }
  }

  return res.status(200).json({
    name,
    email,
    ...scored,
    interpretation
  });
}
