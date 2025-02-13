import express from "express";
import { Sequelize, DataTypes, Op } from "sequelize";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const sequelize = new Sequelize("ald", "root", "Areesha1$", {
  host: "localhost",
  dialect: "mysql",
});

import mysql from "mysql2/promise";
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "Areesha1$",
  database: "ald",
});

pool
  .getConnection()
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Error connecting to database:", err));

// Define existing models
const Judgment = sequelize.define(
  "Judgment",
  {
    judgmentId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentCitation: DataTypes.STRING,
    judgmentNo: DataTypes.STRING,
    judgmentYear: DataTypes.STRING,
    judgmentNoText: DataTypes.TEXT,
    judgmentDOJ: DataTypes.STRING,
    judgmentType: DataTypes.STRING,
    judgmentPetitioner: DataTypes.TEXT,
    judgmentRespondent: DataTypes.TEXT,
    judgmentParties: DataTypes.TEXT,
    courtId: DataTypes.INTEGER,
    judgmentCourtText: DataTypes.TEXT,
    judgmentPetitionerCouncil: DataTypes.TEXT,
    judgmentRespondentCouncil: DataTypes.TEXT,
    judgmentOtherCounsel: DataTypes.TEXT,
    operatorId: DataTypes.INTEGER,
    judgmentEntryDate: DataTypes.STRING,
    judgmentJudges: DataTypes.STRING,
    judgmentDocFile: DataTypes.STRING,
    judgmentJudicialObservation: DataTypes.TEXT,
  },
  {
    tableName: "judgment",
    timestamps: false,
  }
);

const JudgmentText = sequelize.define(
  "JudgmentText",
  {
    judgementTextId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    judgementTextHTML: DataTypes.TEXT,
    judgementTextDeliveredBy: DataTypes.TEXT,
    judgementTextResult: DataTypes.TEXT,
    judgementTextNo: DataTypes.INTEGER,
  },
  {
    tableName: "judgementtext",
    timestamps: false,
  }
);

const JudgmentTextPara = sequelize.define(
  "JudgmentTextPara",
  {
    judgementTextParaId: { type: DataTypes.INTEGER, primaryKey: true },
    judgementTextId: {
      type: DataTypes.INTEGER,
      references: { model: JudgmentText, key: "judgementTextId" },
    },
    judgementTextParaNo: DataTypes.STRING,
    judgementTextParaText: DataTypes.TEXT,
    judgementTextParaType: DataTypes.STRING,
  },
  {
    tableName: "judgementtextpara",
    timestamps: false,
  }
);

// Define new models with new table names and relationships
const ShortNote = sequelize.define(
  "ShortNote",
  {
    shortNoteId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    shortNoteText: DataTypes.TEXT,
  },
  {
    tableName: "shortnote",
    timestamps: false,
  }
);

const ShortNotePara = sequelize.define(
  "ShortNotePara",
  {
    shortNoteParaId: { type: DataTypes.INTEGER, primaryKey: true },
    shortNoteId: {
      type: DataTypes.INTEGER,
      references: { model: ShortNote, key: "shortNoteId" },
    },
    shortNoteParaText: DataTypes.TEXT,
    shortNoteParaLink: DataTypes.TEXT,
    shortNoteParaJudgmentNo: DataTypes.INTEGER,
  },
  {
    tableName: "shortnotepara",
    timestamps: false,
  }
);

const LongNote = sequelize.define(
  "LongNote",
  {
    longNoteId: { type: DataTypes.INTEGER, primaryKey: true },
    shortNoteId: {
      type: DataTypes.INTEGER,
      references: { model: ShortNote, key: "shortNoteId" },
    },
    longNoteText: DataTypes.TEXT,
  },
  {
    tableName: "longnote",
    timestamps: false,
  }
);

const LongNotePara = sequelize.define(
  "LongNotePara",
  {
    longNoteParaId: { type: DataTypes.INTEGER, primaryKey: true },
    longNoteId: {
      type: DataTypes.INTEGER,
      references: { model: LongNote, key: "longNoteId" },
    },
    longNoteParaText: DataTypes.TEXT,
    longNoteParaLink: DataTypes.STRING, // Define the new column `longNoteParaLink`
  },
  {
    tableName: "longnotepara",
    timestamps: false,
  }
);

const judgmentsCited = sequelize.define(
  "judgmentsCited",
  {
    judgmentsCitedId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    judgementTextId: {
      type: DataTypes.INTEGER,
      references: { model: JudgmentText, key: "judgementTextId" },
    },
    judgmentsCitedParties: { type: DataTypes.STRING, allowNull: true },
    judgmentsCitedRefferedCitation: { type: DataTypes.TEXT, allowNull: true }, // Make sure this spelling is correct
    judgmentsCitedEqualCitation: { type: DataTypes.TEXT, allowNull: true },
    judgmentsCitedParaLink: { type: DataTypes.TEXT, allowNull: true },
    judgmentsCitedText: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "judgmentscited",
    timestamps: false,
  }
);

const Topic = sequelize.define(
  "Topic",
  {
    topicId: { type: DataTypes.INTEGER, primaryKey: true },
    topicName: { type: DataTypes.STRING(300) },
  },
  {
    tableName: "topic",
    timestamps: false,
  }
);

const Orders = sequelize.define(
  "Orders",
  {
    ordersId: { type: DataTypes.INTEGER, primaryKey: true },
    ordersName: { type: DataTypes.STRING(200) },
    ordersCitation: { type: DataTypes.STRING(20) },
    ordersDateTime: { type: DataTypes.STRING(20) },
    ordersFile: { type: DataTypes.STRING(200) },
    ordersAuthor: { type: DataTypes.STRING(100) },
  },
  {
    tableName: "orders",
    timestamps: false,
  }
);

const JudgmentTopics = sequelize.define(
  "JudgmentTopics",
  {
    judgmentTopicsId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    topicId: {
      type: DataTypes.INTEGER,
      references: { model: Topic, key: "topicId" },
    },
  },
  {
    tableName: "judgmenttopics",
    timestamps: false,
  }
);

const JudgmentStatusType = sequelize.define(
  "JudgmentStatusType",
  {
    judgmentStatusTypeId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentStatusTypeName: { type: DataTypes.STRING(200) },
    judgmentStatusTypeText: { type: DataTypes.TEXT },
  },
  {
    tableName: "judgmentstatustype",
    timestamps: false,
  }
);

const JudgmentStatus = sequelize.define(
  "JudgmentStatus",
  {
    judgmentStatusId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentStatusTypeId: {
      type: DataTypes.INTEGER,
      references: { model: JudgmentStatusType, key: "judgmentStatusTypeId" },
    },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    judgmentStatusALDCitation: { type: DataTypes.STRING(200) },
    judgmentStatusLinkCitation: { type: DataTypes.STRING(200) },
    judgmentStatusLeftRight: { type: DataTypes.STRING }, // Assuming it's a string, you can adjust the type as needed
  },
  {
    tableName: "judgmentstatus",
    timestamps: false,
  }
);

const JudgmentCaseNos = sequelize.define(
  "JudgmentCaseNos",
  {
    judgmentCaseNosId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    judgmentCaseNo: { type: DataTypes.STRING(100) },
    judgmentCaseYear: { type: DataTypes.STRING(10) },
  },
  {
    tableName: "judgmentcasenos",
    timestamps: false,
  }
);

const Judge = sequelize.define(
  "Judge",
  {
    judgeId: { type: DataTypes.INTEGER, primaryKey: true },
    judgeName: { type: DataTypes.STRING(200) },
  },
  {
    tableName: "judge",
    timestamps: false,
  }
);

const CourtType = sequelize.define(
  "CourtType",
  {
    courtTypeId: { type: DataTypes.INTEGER, primaryKey: true },
    courtTypeName: { type: DataTypes.STRING(200) },
    courtTypeDesc: { type: DataTypes.TEXT },
  },
  {
    tableName: "courttype",
    timestamps: false,
  }
);

const Court = sequelize.define(
  "Court",
  {
    courtId: { type: DataTypes.INTEGER, primaryKey: true },
    courtTypeId: {
      type: DataTypes.INTEGER,
      references: { model: CourtType, key: "courtTypeId" },
    },
    courtName: { type: DataTypes.STRING(200) },
    courtShortName: { type: DataTypes.STRING(20) },
  },
  {
    tableName: "court",
    timestamps: false,
  }
);

const Citation = sequelize.define(
  "Citation",
  {
    citationId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    publicationYearId: { type: DataTypes.INTEGER },
    courtId: {
      type: DataTypes.INTEGER,
      references: { model: Court, key: "courtId" },
    },
    citationText: { type: DataTypes.STRING(200) },
    publicationVolume: { type: DataTypes.STRING(100) },
    publicationPart: { type: DataTypes.STRING(100) },
    citationCourtName: { type: DataTypes.STRING(200) },
    citationPageNo: { type: DataTypes.INTEGER },
    citationBench: { type: DataTypes.STRING(10) },
  },
  {
    tableName: "citation",
    timestamps: false,
  }
);

const EqualCitation = sequelize.define(
  "EqualCitation",
  {
    equalCitationId: { type: DataTypes.INTEGER, primaryKey: true },
    judgmentId: {
      type: DataTypes.INTEGER,
      references: { model: Judgment, key: "judgmentId" },
    },
    equalCitationText: { type: DataTypes.STRING(300) },
  },
  {
    tableName: "equalcitation",
    timestamps: false,
  }
);
const PublicationYear = sequelize.define(
  "publicationyear",
  {
    publicationYearId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    publicationYearNo: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    // Additional model options
    tableName: "publicationyear", // Set the table name explicitly
    timestamps: false, // Disable timestamps
  }
);

// Define associations
Judgment.hasMany(JudgmentText, { foreignKey: "judgmentId" });
JudgmentText.belongsTo(Judgment, { foreignKey: "judgmentId" });

JudgmentText.hasMany(JudgmentTextPara, { foreignKey: "judgementTextId" });
JudgmentTextPara.belongsTo(JudgmentText, { foreignKey: "judgementTextId" });

JudgmentText.hasMany(judgmentsCited, { foreignKey: "judgementTextId" });
judgmentsCited.belongsTo(JudgmentText, { foreignKey: "judgementTextId" });

Judgment.hasMany(ShortNote, { foreignKey: "judgmentId" });
ShortNote.belongsTo(Judgment, { foreignKey: "judgmentId" });

Judgment.hasMany(JudgmentTopics, { foreignKey: "judgmentId" });
JudgmentTopics.belongsTo(Judgment, { foreignKey: "judgmentId" });

Judgment.hasMany(Court, { foreignKey: "judgmentId" });
Court.belongsTo(Judgment, { foreignKey: "judgmentId" });

Judgment.hasMany(JudgmentStatus, { foreignKey: "judgmentId" });
JudgmentStatus.belongsTo(Judgment, { foreignKey: "judgmentId" });

Judgment.hasMany(JudgmentCaseNos, { foreignKey: "judgmentId" });
JudgmentCaseNos.belongsTo(Judgment, { foreignKey: "judgmentId" });

Judgment.hasMany(Citation, { foreignKey: "judgmentId" });
Citation.belongsTo(Judgment, { foreignKey: "judgmentId" });

ShortNote.hasMany(ShortNotePara, { foreignKey: "shortNoteId" });
ShortNotePara.belongsTo(ShortNote, { foreignKey: "shortNoteId" });

ShortNote.hasMany(LongNote, { foreignKey: "shortNoteId" });
LongNote.belongsTo(ShortNote, { foreignKey: "shortNoteId" });

LongNote.hasMany(LongNotePara, { foreignKey: "longNoteId" });
LongNotePara.belongsTo(LongNote, { foreignKey: "longNoteId" });

Topic.hasMany(JudgmentTopics, { foreignKey: "topicId" });
JudgmentTopics.belongsTo(Topic, { foreignKey: "topicId" });

// JudgmentStatusType and JudgmentStatus
JudgmentStatusType.hasMany(JudgmentStatus, {
  foreignKey: "judgmentStatusTypeId",
});
JudgmentStatus.belongsTo(JudgmentStatusType, {
  foreignKey: "judgmentStatusTypeId",
});

// Court and related tables
Court.hasMany(Citation, { foreignKey: "courtId" });
Citation.belongsTo(Court, { foreignKey: "courtId" });

CourtType.hasMany(Court, { foreignKey: "courtTypeId" });
Court.belongsTo(CourtType, { foreignKey: "courtTypeId" });

//Equals
Judgment.hasMany(EqualCitation, { foreignKey: "judgmentId" });
EqualCitation.belongsTo(Judgment, { foreignKey: "judgmentId" });

Citation.belongsTo(PublicationYear, { foreignKey: "publicationYearId" });
PublicationYear.hasMany(Citation, { foreignKey: "publicationYearId" });

// API endpoint for shortnote search
app.post("/judgments/search", async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const judgments = await Judgment.findAll({
      include: [
        {
          model: ShortNote,
          where: {
            shortNoteText: {
              [Op.like]: `%${searchTerm}%`,
            },
          },
          attributes: ["shortNoteText"],
        },
      ],
      attributes: ["id", "title"], // Modify as needed
    });

    if (!judgments.length) {
      return res.status(404).json({ error: "No judgments found" });
    }

    console.log("Fetched search results:", JSON.stringify(judgments, null, 2));
    res.json(judgments);
  } catch (error) {
    console.error("Error searching judgments:", error);
    res.status(500).send("Internal Server Error");
  }
});

//affan
// Handling GET requests to /api/search
app.get("/api/search", async (req, res) => {
  const { legislationName, section, subsection } = req.query; // Extracting query parameters
  try {
    // Calling the function to get search results based on legislationName, section, and subsection
    const results = await getSearchResults(
      legislationName,
      section,
      subsection
    );
    // Sending the results as JSON response
    res.json(results);
  } catch (error) {
    // Handling errors - logging and sending 500 Internal Server Error response
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//affan
//fetching corresponding judgment data with legislation(SECTION)
export async function getSearchResults(legislationName, section, subsection) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
          SELECT 
              j.*,
              j.judgmentId,
              j.judgmentCitation,
              sn.shortNoteId,
              sn.shortNoteText,
              l.legislationId,
              l.legislationName,
              ls.legislationSectionId,
              CONCAT(ls.legislationSectionPrefix, ' ', ls.legislationSectionNo) AS legislationSectionCombined,
              ls.legislationSectionName,
              lss.legislationSubSectionId,
              lss.legislationSubSectionName,
              c.courtName
          FROM 
              judgment j
            left join 
              court c on j.courtId = c.courtId
          LEFT JOIN 
              shortnote sn ON j.judgmentId = sn.judgmentId
          LEFT JOIN 
              shortnoteleg snl ON sn.shortNoteId = snl.shortNoteId
          LEFT JOIN 
              legislation l ON snl.legislationId = l.legislationId
          LEFT JOIN 
              shortnotelegsec snls ON sn.shortNoteId = snls.shortNoteId
          LEFT JOIN 
              legislationsection ls ON snls.legislationSectionId = ls.legislationSectionId
          LEFT JOIN 
              shortnotelegsubsec snlss ON sn.shortNoteId = snlss.shortNoteId
          LEFT JOIN 
              legislationsubsection lss ON snlss.legislationSubSectionId = lss.legislationSubSectionId
          WHERE 
              (? IS NULL OR l.legislationName LIKE ?)
              AND (? IS NULL OR CONCAT(ls.legislationSectionPrefix, ' ', ls.legislationSectionNo) LIKE ?)
              AND (? IS NULL OR lss.legislationSubSectionName LIKE ?)
            ORDER BY 
              j.judgmentCitation DESC
      `;

    const queryParams = [
      legislationName ? `%${legislationName}%` : null,
      legislationName ? `%${legislationName}%` : null,
      section ? `%${section}%` : null,
      section ? `%${section}%` : null,
      subsection ? `%${subsection}%` : null,
      subsection ? `%${subsection}%` : null,
    ];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// API endpoint to fetch judgments along with related data
app.get("/judgments/:judgmentId", async (req, res) => {
  const { judgmentId } = req.params;

  try {
    const judgment = await Judgment.findByPk(judgmentId, {
      include: [
        {
          model: JudgmentText,
          include: [
            {
              model: JudgmentTextPara,
              attributes: ["judgementTextParaText", "judgementTextParaNo"], // Include judgementTextParaNo here
            },
            {
              model: judgmentsCited,
              attributes: [
                "judgmentsCitedParties",
                "judgmentsCitedRefferedCitation",
                "judgmentsCitedEqualCitation",
                "judgmentsCitedParaLink",
              ],
            },
          ],
        },
        {
          model: ShortNote,
          include: [
            {
              model: ShortNotePara,
              attributes: ["shortNoteParaText"],
            },
            {
              model: LongNote,
              include: {
                model: LongNotePara,
                attributes: ["longNoteParaText", "longNoteParaLink"],
              },
            },
          ],
          attributes: ["shortNoteText"],
        },
        {
          model: JudgmentStatus,
          include: [JudgmentStatusType],
        },
        {
          model: EqualCitation,
          attributes: ["equalCitationText"],
        },
      ],
    });

    if (!judgment) {
      return res.status(404).json({ error: "Judgment not found" });
    }

    console.log("Fetched judgment data:", JSON.stringify(judgment, null, 2));
    res.json(judgment);
  } catch (error) {
    console.error("Error fetching judgment:", error.stack); // Log the full error stack
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message }); // Return error details
  }
});

// Define the Topic model

// API endpoint for topic search

app.get("/api/searchByTopic", async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    return res.status(400).json({ error: "Search topic is required" });
  }

  try {
    // Calling the function to get search results based on the term
    const results = await getJudgmentsByTopic(topic);
    // Sending the results as JSON response
    res.json(results);
  } catch (error) {
    // Handling errors - logging and sending 500 Internal Server Error response
    console.error("Error searching judgments by topic:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export async function getJudgmentsByTopic(topic) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
            SELECT 
            j.*,
                j.judgmentId,
                j.judgmentCitation,
                c.courtName
            FROM 
                judgment j
            left join 
              court c on j.courtId = c.courtId
            
            INNER JOIN 
                judgmenttopics jt ON j.judgmentId = jt.judgmentId
            INNER JOIN 
                topic t ON jt.topicId = t.topicId
            WHERE 
                t.topicName LIKE ?
            ORDER BY 
              j.judgmentCitation DESC
        `;

    const queryParams = [`%${topic}%`];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

app.get("/api/searchByCaseNo", async (req, res) => {
  const { caseinfo } = req.query;
  if (!caseinfo) {
    return res.status(400).json({ error: "caseinfo is required" });
  }
  try {
    const results = await getSearchByCaseNo(caseinfo);
    res.json(results);
  } catch (error) {
    console.error("Error searching by nominal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export async function getSearchByCaseNo(caseinfo) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
            SELECT 
            j.*,
                j.judgmentId,
                j.judgmentNoText,
                j.judgmentCitation,
                j.judgmentParties,
                 ct.citationCourtName,
                 c.courtName
            FROM 
                judgment j
            left join 
              court c on j.courtId = c.courtId
                 left join
              citation ct on j.judgmentid= ct.judgmentid
              
            WHERE 
                j.judgmentNoText LIKE ?
            ORDER BY 
              j.judgmentCitation DESC
        `;
    const queryParams = [`%${caseinfo}%`];
    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Articles
///ARTICLES
//defining articles models
const Articles = sequelize.define(
  "Articles",
  {
    articlesId: { type: DataTypes.INTEGER, primaryKey: true },
    articlesName: { type: DataTypes.STRING(300) },
    articlesCitation: { type: DataTypes.STRING(100) },
    articlesDateTime: { type: DataTypes.STRING(20) },
    articlesFile: { type: DataTypes.STRING(100) },
    articlesAuthor: { type: DataTypes.STRING(100) },
    articlesYear: { type: DataTypes.STRING(20) },
    articlesPublication: { type: DataTypes.STRING(20) },
    articlesPageNo: { type: DataTypes.STRING(20) },
  },
  {
    tableName: "articles",
    timestamps: false,
  }
);

// routes for articles search
app.get("/search", async (req, res) => {
  const { term } = req.query;

  try {
    let articles;

    if (term) {
      // If a search term is provided, search by name or author
      articles = await Articles.findAll({
        where: {
          [Op.or]: [
            { articlesName: { [Op.like]: `%${term}%` } },
            { articlesAuthor: { [Op.like]: `%${term}%` } },
          ],
        },
        order: [["articlesName", "ASC"]], // Order by articlesName alphabetically
      });
    } else {
      // If no search term is provided, fetch all articles
      articles = await Articles.findAll({
        order: [["articlesName", "ASC"]], // Order by articlesName alphabetically
      });
    }
    if (!articles.length) {
      return res.status(404).json({ error: "No articles found" });
    }

    res.json(articles);
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).send("Internal Server Error");
  }
});

const Judges = sequelize.define(
  "Judges",
  {
    judgesId: { type: DataTypes.INTEGER, primaryKey: true },
    judgesName: { type: DataTypes.STRING(200) },
    judgesCitation: { type: DataTypes.STRING(100) },
    judgesDateTime: { type: DataTypes.STRING(20) },
    judgesFile: { type: DataTypes.STRING(100) },
    judgesAuthor: { type: DataTypes.STRING(100) },
  },
  {
    tableName: "judges",
    timestamps: false,
  }
);

app.get("/search", async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const articles = await Articles.findAll({
      where: {
        [Op.or]: [
          { articlesName: { [Op.like]: `%${term}%` } },
          { articlesAuthor: { [Op.like]: `%${term}%` } },
        ],
      },
    });

    if (!articles.length) {
      return res.status(404).json({ error: "No articles found" });
    }

    res.json(articles);
  } catch (error) {
    console.error("Error searching articles:", error);
    res.status(500).send("Internal Server Error");
  }
});

//routes for judge search
app.get("/searchJudges", async (req, res) => {
  const { term } = req.query;

  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  try {
    const judges = await Judges.findAll({
      where: {
        [Op.or]: [
          { judgesName: { [Op.like]: `%${term}%` } },
          { judgesAuthor: { [Op.like]: `%${term}%` } },
        ],
      },
    });

    if (!judges.length) {
      return res.status(404).json({ error: "No judges found" });
    }

    res.json(judges);
  } catch (error) {
    console.error("Error searching judges:", error);
    res.status(500).send("Internal Server Error");
  }
});

//NOminal index
app.get("/api/searchByNominal", async (req, res) => {
  const { nominal } = req.query;

  if (!nominal) {
    return res.status(400).json({ error: "Nominal is required" });
  }

  try {
    const results = await getSearchByNominal(nominal);
    res.json(results);
  } catch (error) {
    console.error("Error searching by nominal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export async function getSearchByNominal(nominal) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
            SELECT 
            j.*,
                j.judgmentId,
                j.judgmentCitation,
                j.judgmentParties,
            c.courtName
            FROM 
                judgment j
            left join 
              court c on j.courtId = c.courtId
            WHERE 
                j.judgmentParties LIKE ?
              ORDER BY 
              j.judgmentCitation DESC
        `;

    const queryParams = [`%${nominal}%`];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

app.get("/api/searchByCaseno", async (req, res) => {
  const { caseType, caseNo, caseYear } = req.query;

  if (!caseType && !caseNo && !caseYear) {
    return res
      .status(400)
      .json({ error: "At least one search parameter is required" });
  }

  try {
    const results = await getSearchByCaseno(caseType, caseNo, caseYear);
    res.json(results);
  } catch (error) {
    console.error("Error searching by case number:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export async function getSearchByCaseno(caseType, caseNo, caseYear) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
            SELECT 
            j.*,
                j.judgmentId,
                j.judgmentCitation,
                jc.judgmentCaseNo,
                jc.judgmentCaseYear
             c.courtName
            FROM 
                judgment j
            left join 
              court c on j.courtId = c.courtId
            INNER JOIN 
                judgmentcasenos jc ON j.judgmentId = jc.judgmentId
            WHERE 
                (? IS NULL OR jc.judgmentCaseNo LIKE ?)
                AND (? IS NULL OR jc.judgmentCaseNo LIKE ?)
                AND (? IS NULL OR jc.judgmentCaseYear LIKE ?)
                ORDER BY 
              j.judgmentCitation DESC
        `;

    const queryParams = [
      caseType ? `%${caseType}%` : null,
      caseType ? `%${caseType}%` : null,
      caseNo ? `%${caseNo}%` : null,
      caseNo ? `%${caseNo}%` : null,
      caseYear ? `%${caseYear}%` : null,
      caseYear ? `%${caseYear}%` : null,
    ];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

app.get("/api/searchByJudge", async (req, res) => {
  const { judge } = req.query;

  if (!judge) {
    return res.status(400).json({ error: "Judge name is required" });
  }

  try {
    const results = await getSearchByJudge(judge);
    res.json(results);
  } catch (error) {
    console.error("Error searching by judge:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export async function getSearchByJudge(judge) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
            SELECT 
            j.*,
            c.courtName,
                j.judgmentId,
                j.judgmentCitation,
                j.judgmentParties
            FROM 
                judgment j
            INNER JOIN 
                judgmentjudges jj ON j.judgmentId = jj.judgmentId
            INNER JOIN 
                judge ju ON jj.judgeId = ju.judgeId
              left join 
              court c on j.courtId = c.courtId
            WHERE 
                ju.judgeName LIKE ?
            ORDER BY 
              j.judgmentCitation DESC
        `;

    const queryParams = [`%${judge}%`];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

app.get("/api/searchByAdvocate", async (req, res) => {
  const { advocateName } = req.query;

  if (!advocateName) {
    return res.status(400).json({ error: "Advocate name is required" });
  }

  try {
    const results = await getSearchByAdvocate(advocateName);
    res.json(results);
  } catch (error) {
    console.error("Error searching by advocate name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export async function getSearchByAdvocate(advocateName) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
          SELECT 
          j.*,
              j.judgmentId,
              j.judgmentCitation,
              j.judgmentParties,
              a.advocateName,
           c.courtName
            FROM 
                judgment j
            left join 
              court c on j.courtId = c.courtId
          INNER JOIN 
              judgmentadvocates ja ON j.judgmentId = ja.judgmentId
          INNER JOIN 
              advocate a ON ja.advocateId = a.advocateId
          WHERE 
              a.advocateName LIKE ?
            ORDER BY 
              j.judgmentCitation DESC
      `;

    const queryParams = [`%${advocateName}%`];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//citation index
app.get("/api/searchByCitation", async (req, res) => {
  const { CitationText } = req.query;
  if (!CitationText) {
    return res.status(400).json({ error: "citation is required" });
  }
  try {
    const results = await getSearchByCitation(CitationText);
    res.json(results);
  } catch (error) {
    console.error("Error searching by Citation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export async function getSearchByCitation(CitationText) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
            SELECT 
            j.*,
                j.judgmentId,
                j.judgmentNoText,
                j.judgmentCitation,
                j.judgmentParties,
                 ct.citationCourtName,
                 c.courtName
            FROM 
                judgment j
                 left join
              citation ct on j.judgmentid= ct.judgmentid
              left join 
              court c on j.courtId = c.courtId
            WHERE 
                j.judgmentCitation LIKE ?
            ORDER BY 
              j.judgmentCitation DESC
        `;
    const queryParams = [`${CitationText}`];
    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Equivalent Index

app.get("/api/searchByEquivalent", async (req, res) => {
  const { EqualText } = req.query;
  if (!EqualText) {
    return res.status(400).json({ error: "EqualText is required" });
  }
  try {
    const results = await getSearchByEquivalent(EqualText);
    res.json(results);
  } catch (error) {
    console.error("Error searching by Equal:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
export async function getSearchByEquivalent(EqualText) {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `
          SELECT 
          j.*,
              j.judgmentId,
              j.judgmentNoText,
              j.judgmentCitation,
              j.judgmentParties,
               c.courtName
          FROM 
              judgment j
               left join
             equalcitation e on j.judgmentid= e.judgmentid
            left join 
            court c on j.courtId = c.courtId
          WHERE 
              e.equalCitationText LIKE ?
          ORDER BY 
              j.judgmentCitation DESC
      `;
    const queryParams = [`${EqualText}`];
    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//ADVANCE SEARCH PAGE
app.get("/api/searchAdvanced", async (req, res) => {
  const acts = Array.isArray(req.query.acts)
    ? req.query.acts
    : req.query.acts
    ? [req.query.acts]
    : [];
  const sections = Array.isArray(req.query.sections)
    ? req.query.sections
    : req.query.sections
    ? [req.query.sections]
    : [];
  const subsections = Array.isArray(req.query.subsections)
    ? req.query.subsections
    : req.query.subsections
    ? [req.query.subsections]
    : [];
  const topics = Array.isArray(req.query.topics)
    ? req.query.topics
    : req.query.topics
    ? [req.query.topics]
    : [];
  const judges = Array.isArray(req.query.judges)
    ? req.query.judges
    : req.query.judges
    ? [req.query.judges]
    : [];
  const advocates = Array.isArray(req.query.advocates)
    ? req.query.advocates
    : req.query.advocates
    ? [req.query.advocates]
    : [];

  if (
    acts.length === 0 &&
    sections.length === 0 &&
    subsections.length === 0 &&
    topics.length === 0 &&
    judges.length === 0 &&
    advocates.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "At least one search parameter is required" });
  }

  try {
    const results = await getJudgmentsByMultipleCriteria(
      acts,
      sections,
      subsections,
      topics,
      judges,
      advocates
    );
    res.json(results);
  } catch (error) {
    console.error("Error executing advanced search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/searchAdvanced", async (req, res) => {
  const acts = Array.isArray(req.query.acts)
    ? req.query.acts
    : req.query.acts
    ? [req.query.acts]
    : [];
  const sections = Array.isArray(req.query.sections)
    ? req.query.sections
    : req.query.sections
    ? [req.query.sections]
    : [];
  const subsections = Array.isArray(req.query.subsections)
    ? req.query.subsections
    : req.query.subsections
    ? [req.query.subsections]
    : [];
  const topics = Array.isArray(req.query.topics)
    ? req.query.topics
    : req.query.topics
    ? [req.query.topics]
    : [];
  const judges = Array.isArray(req.query.judges)
    ? req.query.judges
    : req.query.judges
    ? [req.query.judges]
    : [];
  const advocates = Array.isArray(req.query.advocates)
    ? req.query.advocates
    : req.query.advocates
    ? [req.query.advocates]
    : [];

  if (
    acts.length === 0 &&
    sections.length === 0 &&
    subsections.length === 0 &&
    topics.length === 0 &&
    judges.length === 0 &&
    advocates.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "At least one search parameter is required" });
  }

  try {
    const results = await getJudgmentsByMultipleCriteria(
      acts,
      sections,
      subsections,
      topics,
      judges,
      advocates
    );
    res.json(results);
  } catch (error) {
    console.error("Error executing advanced search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export async function getJudgmentsByMultipleCriteria(
  actKeywords,
  sectionKeywords,
  subsectionKeywords,
  topicKeywords,
  judgeKeywords,
  advocateKeywords
) {
  let connection;
  try {
    connection = await pool.getConnection();

    let query = `
          SELECT DISTINCT
              j.judgmentId,
              j.judgmentCitation,
              j.judgmentParties,
              a.advocateName,
              j.judgmentDOJ,
              c.courtName
          FROM 
              judgment j
              left join 
            court c on j.courtId = c.courtId
          LEFT JOIN shortnote sn ON j.judgmentId = sn.judgmentId
          LEFT JOIN shortnoteleg snl ON sn.shortNoteId = snl.shortNoteId
          LEFT JOIN legislation l ON snl.legislationId = l.legislationId
          LEFT JOIN shortnotelegsec snls ON sn.shortNoteId = snls.shortNoteId
          LEFT JOIN legislationsection ls ON snls.legislationSectionId = ls.legislationSectionId
          LEFT JOIN shortnotelegsubsec snlss ON sn.shortNoteId = snlss.shortNoteId
          LEFT JOIN legislationsubsection lss ON snlss.legislationSubSectionId = lss.legislationSubSectionId
          INNER JOIN judgmenttopics jt ON j.judgmentId = jt.judgmentId
          INNER JOIN topic t ON jt.topicId = t.topicId
          INNER JOIN judgmentjudges jj ON j.judgmentId = jj.judgmentId
          INNER JOIN judge ju ON jj.judgeId = ju.judgeId
          INNER JOIN judgmentadvocates ja ON j.judgmentId = ja.judgmentId
          INNER JOIN advocate a ON ja.advocateId = a.advocateId
          WHERE 
      `;

    const conditions = [];

    if (actKeywords.length > 0) {
      actKeywords.forEach((_) => {
        conditions.push(`
                  EXISTS (
                      SELECT 1 
                      FROM shortnote sn
                      JOIN shortnoteleg snl ON sn.shortNoteId = snl.shortNoteId
                      JOIN legislation l ON snl.legislationId = l.legislationId
                      WHERE sn.judgmentId = j.judgmentId 
                      AND l.legislationName LIKE ?
                      
                  )
              `);
      });
    }

    if (sectionKeywords.length > 0) {
      sectionKeywords.forEach((_) => {
        conditions.push(`
                  EXISTS (
                      SELECT 1 
                      FROM shortnote sn
                      JOIN shortnotelegsec snls ON sn.shortNoteId = snls.shortNoteId
                      JOIN legislationsection ls ON snls.legislationSectionId = ls.legislationSectionId
                      WHERE sn.judgmentId = j.judgmentId 
                      AND ls.legislationSectionName LIKE ?
                  )
              `);
      });
    }

    if (subsectionKeywords.length > 0) {
      subsectionKeywords.forEach((_) => {
        conditions.push(`
                  EXISTS (
                      SELECT 1 
                      FROM shortnote sn
                      JOIN shortnotelegsubsec snlss ON sn.shortNoteId = snlss.shortNoteId
                      JOIN legislationsubsection lss ON snlss.legislationSubSectionId = lss.legislationSubSectionId
                      WHERE sn.judgmentId = j.judgmentId 
                      AND lss.legislationSubSectionName LIKE ?
                  )
              `);
      });
    }

    if (topicKeywords.length > 0) {
      topicKeywords.forEach((_) => {
        conditions.push(`
                  EXISTS (
                      SELECT 1 
                      FROM judgmenttopics jt
                      JOIN topic t ON jt.topicId = t.topicId
                      WHERE jt.judgmentId = j.judgmentId 
                      AND t.topicName LIKE ?
                  )
              `);
      });
    }

    if (judgeKeywords.length > 0) {
      judgeKeywords.forEach((_) => {
        conditions.push(`
                  EXISTS (
                      SELECT 1 
                      FROM judgmentjudges jj
                      JOIN judge ju ON jj.judgeId = ju.judgeId
                      WHERE jj.judgmentId = j.judgmentId 
                      AND ju.judgeName LIKE ?
                  )
              `);
      });
    }

    if (advocateKeywords.length > 0) {
      advocateKeywords.forEach((_) => {
        conditions.push(`
                  EXISTS (
                      SELECT 1 
                      FROM judgmentadvocates ja
                      JOIN advocate a ON ja.advocateId = a.advocateId
                      WHERE ja.judgmentId = j.judgmentId 
                      AND a.advocateName LIKE ?
                  )
              `);
      });
    }

    query += conditions.join(" AND ");

    query += `
            ORDER BY 
                j.judgmentCitation DESC
        `;

    const queryParams = [
      ...actKeywords.map((kw) => `%${kw}%`),
      ...sectionKeywords.map((kw) => `%${kw}%`),
      ...subsectionKeywords.map((kw) => `%${kw}%`),
      ...topicKeywords.map((kw) => `%${kw}%`),
      ...judgeKeywords.map((kw) => `%${kw}%`),
      ...advocateKeywords.map((kw) => `%${kw}%`),
    ];

    const [rows] = await connection.execute(query, queryParams);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

//Drop Downs
//list acts
async function getLegislationNames() {
  let connection;
  try {
    connection = await pool.getConnection();
    const query = `SELECT legislationName FROM legislation`;
    const [rows] = await connection.execute(query);
    return rows.map((row) => row.legislationName);
  } catch (error) {
    console.error("Error fetching legislation names:", error);
    throw error; // Re-throw the error for handling in the route
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

app.get("/api/legislation/names", async (req, res) => {
  try {
    const legislationNames = await getLegislationNames();
    res.setHeader("Content-Type", "application/json");
    res.json(legislationNames);
  } catch (error) {
    console.error("Error fetching legislation names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/all-legislation", async (req, res) => {
  try {
    const query = `
      SELECT 
        legislationId,
        legislationName
      FROM 
      legislation
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all legislation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// fetch sections based on prefix and number DropDown
app.get("/api/sections", async (req, res) => {
  try {
    const { legislationId } = req.query;
    const query = `
      SELECT 
        legislationSectionId,
        CONCAT(legislationSectionPrefix, ' ', legislationSectionNo) AS legislationSectionCombined, 
        legislationSectionName
      FROM 
        legislationsection
      WHERE 
        legislationId = ?
    `;
    const [rows] = await pool.query(query, [legislationId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch sub sections DropDown
app.get("/api/subsections", async (req, res) => {
  try {
    const { legislationSectionId } = req.query;
    const query = `
      SELECT 
        legislationSubSectionId,
        legislationSubSectionName
      FROM 
        legislationsubsection
      WHERE 
        legislationSectionId = ?
    `;
    const [rows] = await pool.query(query, [legislationSectionId]);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching subsections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch topics DropDown

app.get("/api/all-topic", async (req, res) => {
  try {
    const query = `
      SELECT 
    topicId,
    topicName
FROM 
    topic
ORDER BY 
    topicName ASC;


    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch Advocates DropDown

app.get("/api/all-advocate", async (req, res) => {
  try {
    const query = `
      SELECT 
      advocateId,
    advocateName
FROM 
    advocate
ORDER BY 
    advocateName ASC;


    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch Judges DropDown
app.get("/api/all-judge", async (req, res) => {
  try {
    const query = `
      SELECT
      judgeId, 
   judgeName
FROM 
    judge
ORDER BY 
    judgeName ASC;


    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch Nominal DropDown

app.get("/api/all-nominal", async (req, res) => {
  try {
    const query = `
      SELECT 
    distinct judgmentId, judgmentParties
FROM 
     judgment
ORDER BY 
    judgmentParties ASC;


    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all topics:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//fetch CaseNo DropDown
app.get("/api/all-caseno", async (req, res) => {
  try {
    const query = `
      SELECT 
     judgmentId, judgmentNoText
FROM 
     judgment
ORDER BY 
    judgmentNoText ASC;


    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all caseno:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch all words from the 'words' table

app.get("/api/all-words", async (req, res) => {
  try {
    const query = `
      SELECT 
        word
      FROM 
        words
      ORDER BY 
        word ASC;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all words:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Statutes
// Route for searching statutes (bareacts)
app.get("/api/search-bareacts", async (req, res) => {
  const { bareActId, bareActName, sectionPrefix, sectionNo, notificationName } =
    req.query;

  try {
    const query = `
      SELECT 
          b.bareActId,
          b.bareActName,
          b.bareActEnactment,
          b.bareActDate,
          b.bareActDesc,
          b.bareActIndex,
          b.bareActShortName,
          b.bareActState,
          s.bareActSectionId,
          s.bareActSectionNo,
          s.bareActSectionName,
          s.bareActSectionPrefix,
          s.bareActSectionText,
          s.bareActState AS sectionState,
          f.bareActFormId,
          f.bareActFormName,
          f.bareActFormHTML,
          n.bareActNotificationId,
          n.bareActNotificationName,
          n.bareActNotificationHTML,
          sch.bareActScheduleId,
          sch.bareActScheduleName,
          sch.bareActScheduleHTML,
          l.legislationId,
          l.legislationTypeId,
          l.legislationNo,
          l.legislationName,
          l.legislationYear,
          l.legislationHtmlContents,
          l.legislationEnactment,
          l.legislationDesc,
          sn.shortNoteId,
          sn.shortNoteText,
          snp.shortNoteParaText,
          snp.shortNoteParaLink,
          ln.longNoteId,
          ln.longNoteText,
          lnp.longNoteParaText,
          lnp.longNoteParaLink
      FROM 
          bareact b
      LEFT JOIN 
          bareactsection s ON b.bareActId = s.bareActId
      LEFT JOIN 
          bareactform f ON b.bareActId = f.bareActId
      LEFT JOIN 
          bareactnotification n ON b.bareActId = n.bareActId
      LEFT JOIN 
          bareactschedule sch ON b.bareActId = sch.bareActId
      LEFT JOIN 
          legislation l ON b.bareActName = l.legislationName
      LEFT JOIN 
          shortnoteleg snl ON l.legislationId = snl.legislationId
      LEFT JOIN 
          shortnote sn ON snl.shortNoteId = sn.shortNoteId
      LEFT JOIN 
          shortnotepara snp ON sn.shortNoteId = snp.shortNoteId
      LEFT JOIN 
          longnote ln ON sn.shortNoteId = ln.shortNoteId
      LEFT JOIN 
          longnotepara lnp ON ln.longNoteId = lnp.longNoteId
      WHERE 
          (? IS NULL OR b.bareActId = ?)
          AND (? IS NULL OR b.bareActName LIKE ?)
          AND (? IS NULL OR s.bareActSectionPrefix LIKE ?)
          AND (? IS NULL OR s.bareActSectionNo LIKE ?)
          AND (? IS NULL OR n.bareActNotificationName LIKE ?);
      `;

    const queryParams = [
      bareActId || null,
      bareActId || null,
      bareActName ? `%${bareActName}%` : null,
      bareActName ? `%${bareActName}%` : null,
      sectionPrefix ? `%${sectionPrefix}%` : null,
      sectionPrefix ? `%${sectionPrefix}%` : null,
      sectionNo ? `%${sectionNo}%` : null,
      sectionNo ? `%${sectionNo}%` : null,
      notificationName ? `%${notificationName}%` : null,
      notificationName ? `%${notificationName}%` : null,
    ];

    console.log("Generated SQL Query:", query);
    console.log("Query Parameters:", queryParams);

    const [rows] = await pool.query(query, queryParams);

    const organizedData = [];

    rows.forEach((row) => {
      const existingItem = organizedData.find(
        (item) => item.bareActId === row.bareActId
      );
      if (existingItem) {
        if (
          row.bareActSectionId &&
          !existingItem.sections.some(
            (section) => section.sectionId === row.bareActSectionId
          )
        ) {
          existingItem.sections.push({
            sectionId: row.bareActSectionId,
            sectionNo: row.bareActSectionNo,
            sectionName: row.bareActSectionName,
            sectionPrefix: row.bareActSectionPrefix,
            sectionText: row.bareActSectionText,
            sectionState: row.sectionState,
          });
        }
        if (
          row.bareActFormId &&
          !existingItem.forms.some((form) => form.formId === row.bareActFormId)
        ) {
          existingItem.forms.push({
            formId: row.bareActFormId,
            formName: row.bareActFormName,
            formHTML: row.bareActFormHTML,
          });
        }
        if (
          row.bareActNotificationId &&
          !existingItem.notifications.some(
            (notification) =>
              notification.notificationId === row.bareActNotificationId
          )
        ) {
          existingItem.notifications.push({
            notificationId: row.bareActNotificationId,
            notificationName: row.bareActNotificationName,
            notificationHTML: row.bareActNotificationHTML,
          });
        }
        if (
          row.bareActScheduleId &&
          !existingItem.schedules.some(
            (schedule) => schedule.scheduleId === row.bareActScheduleId
          )
        ) {
          existingItem.schedules.push({
            scheduleId: row.bareActScheduleId,
            scheduleName: row.bareActScheduleName,
            scheduleHTML: row.bareActScheduleHTML,
          });
        }
        if (!existingItem.legislation) {
          existingItem.legislation = {
            legislationId: row.legislationId,
            legislationTypeId: row.legislationTypeId,
            legislationNo: row.legislationNo,
            legislationName: row.legislationName,
            legislationYear: row.legislationYear,
            legislationHtmlContents: row.legislationHtmlContents,
            legislationEnactment: row.legislationEnactment,
            legislationDesc: row.legislationDesc,
            shortNotes: [],
          };
        }

        let existingShortNote = existingItem.legislation.shortNotes.find(
          (note) => note.shortNoteId === row.shortNoteId
        );
        if (!existingShortNote && row.shortNoteId) {
          existingShortNote = {
            shortNoteId: row.shortNoteId,
            shortNoteText: row.shortNoteText,
            shortNoteParas: [],
            longNotes: [],
          };
          existingItem.legislation.shortNotes.push(existingShortNote);
        }

        if (
          existingShortNote &&
          row.shortNoteParaText &&
          !existingShortNote.shortNoteParas.some(
            (note) => note.shortNoteParaText === row.shortNoteParaText
          )
        ) {
          existingShortNote.shortNoteParas.push({
            shortNoteParaText: row.shortNoteParaText,
            shortNoteParaLink: row.shortNoteParaLink,
          });
        }

        if (
          existingShortNote &&
          row.longNoteId &&
          !existingShortNote.longNotes.some(
            (note) => note.longNoteId === row.longNoteId
          )
        ) {
          existingShortNote.longNotes.push({
            longNoteId: row.longNoteId,
            longNoteText: row.longNoteText,
            longNoteParas: [],
          });
        }

        let existingLongNote = existingShortNote
          ? existingShortNote.longNotes.find(
              (note) => note.longNoteId === row.longNoteId
            )
          : null;
        if (
          existingLongNote &&
          row.longNoteParaText &&
          !existingLongNote.longNoteParas.some(
            (note) => note.longNoteParaText === row.longNoteParaText
          )
        ) {
          existingLongNote.longNoteParas.push({
            longNoteParaText: row.longNoteParaText,
            longNoteParaLink: row.longNoteParaLink,
          });
        }
      } else {
        const newItem = {
          bareActId: row.bareActId,
          bareActName: row.bareActName,
          bareActEnactment: row.bareActEnactment,
          bareActDate: row.bareActDate,
          bareActDesc: row.bareActDesc,
          bareActIndex: row.bareActIndex,
          bareActShortName: row.bareActShortName,
          bareActState: row.bareActState,
          sections: [],
          forms: [],
          notifications: [],
          schedules: [],
          legislation: {
            legislationId: row.legislationId,
            legislationTypeId: row.legislationTypeId,
            legislationNo: row.legislationNo,
            legislationName: row.legislationName,
            legislationYear: row.legislationYear,
            legislationHtmlContents: row.legislationHtmlContents,
            legislationEnactment: row.legislationEnactment,
            legislationDesc: row.legislationDesc,
            shortNotes: [],
          },
        };
        if (row.bareActSectionId) {
          newItem.sections.push({
            sectionId: row.bareActSectionId,
            sectionNo: row.bareActSectionNo,
            sectionName: row.bareActSectionName,
            sectionPrefix: row.bareActSectionPrefix,
            sectionText: row.bareActSectionText,
            sectionState: row.sectionState,
          });
        }
        if (row.bareActFormId) {
          newItem.forms.push({
            formId: row.bareActFormId,
            formName: row.bareActFormName,
            formHTML: row.bareActFormHTML,
          });
        }
        if (row.bareActNotificationId) {
          newItem.notifications.push({
            notificationId: row.bareActNotificationId,
            notificationName: row.bareActNotificationName,
            notificationHTML: row.bareActNotificationHTML,
          });
        }
        if (row.bareActScheduleId) {
          newItem.schedules.push({
            scheduleId: row.bareActScheduleId,
            scheduleName: row.bareActScheduleName,
            scheduleHTML: row.bareActScheduleHTML,
          });
        }

        const newShortNote = row.shortNoteId
          ? {
              shortNoteId: row.shortNoteId,
              shortNoteText: row.shortNoteText,
              shortNoteParas: row.shortNoteParaText
                ? [
                    {
                      shortNoteParaText: row.shortNoteParaText,
                      shortNoteParaLink: row.shortNoteParaLink,
                    },
                  ]
                : [],
              longNotes: row.longNoteId
                ? [
                    {
                      longNoteId: row.longNoteId,
                      longNoteText: row.longNoteText,
                      longNoteParas: row.longNoteParaText
                        ? [
                            {
                              longNoteParaText: row.longNoteParaText,
                              longNoteParaLink: row.longNoteParaLink,
                            },
                          ]
                        : [],
                    },
                  ]
                : [],
            }
          : null;

        if (newShortNote) {
          newItem.legislation.shortNotes.push(newShortNote);
        }

        organizedData.push(newItem);
      }
    });

    res.json(organizedData);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch all bare act names for default display
app.get("/api/all-bareacts", async (req, res) => {
  try {
    const query = `
      SELECT 
        bareActId,
        bareActName
      FROM 
        bareact
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all bare acts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// fetch all courts
app.get("/api/all-courts", async (req, res) => {
  try {
    const query = `
      SELECT 
     *
FROM 
    court
ORDER BY 
    courtName ASC;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all courts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//fetch list of case no citation equals
app.get("/api/all-caseno", async (req, res) => {
  try {
    const query = `
        SELECT 
       judgmentId, judgmentNoText
  FROM 
       judgment
  ORDER BY 
      judgmentNoText ASC;
      `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all caseno:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/all-citation", async (req, res) => {
  try {
    const query = `
        SELECT 
       judgmentId, judgmentCitation
  FROM 
       judgment
  ORDER BY 
      judgmentCitation ASC;
      `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all caseno:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/all-equivalent", async (req, res) => {
  try {
    const query = `
        SELECT 
      *
  FROM 
       equalcitation
  ORDER BY 
      judgmentId ASC;
      `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching all Equals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// latest judgements
// Fetch the latest 5 judgments
app.get("/api/latest-judgments", async (req, res) => {
  try {
    const query = `
      SELECT 
        j.judgmentId,
        j.judgmentParties, 
        STR_TO_DATE(j.judgmentDOJ, '%d%m%Y') AS formattedDOJ, 
        j.judgmentCitation, 
        j.judgmentJudges,
        oc.newCitation
      FROM 
        judgment j
      LEFT JOIN 
        onlinecitation oc ON j.judgmentId = oc.judgmentId
      ORDER BY 
        j.judgmentId DESC 
      LIMIT 8;
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching latest judgments:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT route to update judgmentCitation in the judgment table
// PUT route to update judgmentCitation in the judgment table
app.put("/api/judgment/:id/citation", async (req, res) => {
  const judgmentId = req.params.id;
  const { judgmentCitation } = req.body;

  // Check if judgmentCitation is provided
  if (!judgmentCitation) {
    return res.status(400).json({ error: "judgmentCitation is required" });
  }

  try {
    // Update query
    const [result] = await pool.query(
      `UPDATE judgment SET judgmentCitation = ? WHERE judgmentId = ?`,
      [judgmentCitation, judgmentId]
    );

    // Check if the judgment was found and updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Judgment not found" });
    }

    res.json({ message: "judgmentCitation updated successfully" });
  } catch (error) {
    console.error("Error updating judgmentCitation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//firestore sycn with mysql
app.post("/sync-user", async (req, res) => {
  const { uid, username, email } = req.body;

  if (!uid || !username || !email) {
    return res
      .status(400)
      .json({ error: "Missing required fields: uid, username, or email" });
  }

  try {
    const query = `
          INSERT INTO users (uid, username, email)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE username = VALUES(username), email = VALUES(email);
      `;

    // Use pool.query for database operations
    const [result] = await pool.query(query, [uid, username, email]);

    console.log("User data synced successfully:", result);
    res.status(200).json({ message: "User data synced successfully" });
  } catch (error) {
    console.error("Error syncing user data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//migrate fs users to mysql
// Migrate Firestore users to MySQL
app.post("/api/migrate-users", async (req, res) => {
  const users = req.body.users; // Expecting an array of user objects

  if (!Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ error: "No user data provided" });
  }

  try {
    const values = users.map((user) => [user.uid, user.username, user.email]);

    const query = `
      INSERT INTO users (uid, username, email)
      VALUES ?
      ON DUPLICATE KEY UPDATE username = VALUES(username), email = VALUES(email);
    `;

    const [result] = await pool.query(query, [values]); // Use pool for query execution
    console.log("Users migrated successfully:", result);

    res.status(200).json({ message: "Users migrated successfully", result });
  } catch (error) {
    console.error("Error migrating users:", error.message);
    console.error("Stack trace:", error.stack);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

//test
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res
      .status(200)
      .json({ message: "Database connection works!", result: rows });
  } catch (error) {
    console.error("Database test failed:", error.message);
    res.status(500).json({ error: "Database test failed" });
  }
});

//NOTES
app.post("/api/notes", async (req, res) => {
  const { uid, judgmentId, notesText } = req.body;

  if (!uid || !judgmentId || notesText === undefined) {
    return res
      .status(400)
      .json({ error: "All fields (uid, judgmentId, notesText) are required." });
  }

  try {
    const [result] = await pool.query(
      `
            INSERT INTO notes (uid, judgmentId, notesText)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE notesText = VALUES(notesText)
        `,
      [uid, judgmentId, notesText]
    );

    res.status(200).json({ message: "Note saved successfully." });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/notes", async (req, res) => {
  const { uid, judgmentId } = req.query;

  if (!uid || !judgmentId) {
    return res
      .status(400)
      .json({ error: "Both uid and judgmentId are required." });
  }

  try {
    const [rows] = await pool.query(
      `
          SELECT * FROM notes WHERE uid = ? AND judgmentId = ?
      `,
      [uid, judgmentId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/user-notes/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const [results] = await pool.query(
      `
          SELECT 
              notes.noteId, 
              notes.judgmentId,
              notes.notesText, 
              judgment.judgmentCitation
          FROM notes
          INNER JOIN judgment ON notes.judgmentId = judgment.judgmentId
          WHERE notes.uid = ?
          `,
      [uid]
    );

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching user notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//BOOKMARKS

// POST API to add a bookmark
app.post("/api/bookmarks", async (req, res) => {
  const {
    title,
    note,
    url,
    folder_name,
    folder_id,
    parent_folder_id,
    uid,
    judgmentId,
  } = req.body;

  // Validate required fields
  if (!title || !uid || !judgmentId) {
    return res.status(400).json({
      success: false,
      message: "Title, user ID, and judgment ID are required",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let resolvedFolderId = folder_id;

    // Create new folder if folder_name is provided and folder doesn't exist
    if (folder_name && !folder_id) {
      const [existingFolders] = await connection.query(
        "SELECT id FROM folders WHERE folder_name = ? AND uid = ?",
        [folder_name, uid]
      );

      if (existingFolders.length === 0) {
        const [result] = await connection.query(
          "INSERT INTO folders (folder_name, uid, parent_id) VALUES (?, ?, ?)",
          [folder_name, uid, parent_folder_id || null]
        );
        resolvedFolderId = result.insertId;
      } else {
        resolvedFolderId = existingFolders[0].id;
      }
    }

    // Insert the bookmark
    const [result] = await connection.query(
      "INSERT INTO bookmarks (title, note, url, folder_id, uid, judgmentId) VALUES (?, ?, ?, ?, ?, ?)",
      [title, note || null, url || null, resolvedFolderId, uid, judgmentId]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Bookmark saved successfully",
      bookmarkId: result.insertId,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error saving bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save bookmark",
      error: error.message,
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Get folders for a user
app.get("/api/folders", async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    const [folders] = await pool.query(
      "SELECT id, folder_name, parent_id FROM folders WHERE uid = ? ORDER BY folder_name",
      [uid]
    );

    res.status(200).json({
      success: true,
      folders: folders.length > 0 ? folders : [],
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch folders",
      error: error.message,
    });
  }
});

//Marquee
app.put("/api/marquee", async (req, res) => {
  try {
    const { message } = req.body;
    const [result] = await pool.execute(
      "UPDATE marquee SET message = ? WHERE id = 1",
      [message]
    );
    if (result.affectedRows === 0) {
      await pool.execute("INSERT INTO marquee (id, message) VALUES (1, ?)", [
        message,
      ]);
    }
    res.send({
      success: true,
      message: "Marquee content updated successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to update marquee content" });
  }
});

// API Endpoint to Fetch Current Marquee Content
app.get("/api/marquee", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT message, NOW() as lastUpdated FROM marquee WHERE id = 1"
    );
    if (rows.length > 0) {
      res.send({ success: true, ...rows[0] });
    } else {
      res.send({ success: false, message: "No marquee content found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Failed to fetch marquee content" });
  }
});

// BOOKS

// Multer setup for image uploads
const sanitizeFilename = (name) => {
  return name.replace(/[^a-zA-Z0-9]/g, "_"); // Replace special characters with underscores
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/books/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const bookName = req.body.book_name ? sanitizeFilename(req.body.book_name) : "unknown";
    const ext = path.extname(file.originalname);
    cb(null, `${bookName}_${Date.now()}${ext}`); // Append timestamp to avoid duplicates
  },
});

const upload = multer({ storage });

// Add new book
app.post("/api/books", upload.single("image"), async (req, res) => {
  try {
    const { book_name, edition, price, in_stock } = req.body;
    const imagePath = req.file ? `/uploads/books/${req.file.filename}` : null; // Save relative path

    const inStockValue = in_stock === "true" || in_stock === 1 ? 1 : 0; // Ensure correct format

    const sql =
      "INSERT INTO books (book_name, edition, price, in_stock, image) VALUES (?, ?, ?, ?, ?)";
    const values = [book_name, edition, price, inStockValue, imagePath];

    await pool.query(sql, values);
    res.status(200).json({ success: true, message: "Book added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Database error" });
  }
});

// Serve images statically
app.use("/books", express.static("books"));

// Fetch all books
app.get("/api/books", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, book_name, edition, price, in_stock, image FROM books"
    );
    // Ensure `in_stock` is returned as a boolean for frontend consistency
    const formattedRows = rows.map((book) => ({
      ...book,
      in_stock: book.in_stock === 1 ? true : false,
    }));

    res.send({ success: true, books: formattedRows });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to fetch books" });
  }
});

// Update book details and optionally replace the image
app.put("/api/books/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { book_name, edition, price, in_stock } = req.body;

    const inStockValue = in_stock === "true" || in_stock === 1 ? 1 : 0; // Ensure correct format

    let query = "UPDATE books SET book_name = ?, edition = ?, price = ?, in_stock = ?";
    let params = [book_name, edition, price, inStockValue];

    if (req.file) {
      query += ", image = ?";
      params.push(`/books/${req.file.filename}`);
    }

    query += " WHERE id = ?";
    params.push(id);

    await pool.query(query, params);
    res.send({ success: true, message: "Book updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to update book" });
  }
});

// Toggle in_stock status
app.patch("/api/books/:id/toggle-in-stock", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "UPDATE books SET in_stock = CASE WHEN in_stock = 1 THEN 0 ELSE 1 END WHERE id = ?",
      [id]
    );
    if (result.affectedRows > 0) {
      res.send({ success: true, message: "Book stock status toggled" });
    } else {
      res.status(404).send({ success: false, message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Failed to toggle stock status" });
  }
});

// Use import.meta.url and fileURLToPath to get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/pdfs", express.static(path.join(__dirname, "pdfs")));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Get bookmarks for a user
app.get("/api/bookmarks", async (req, res) => {
  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    const [bookmarks] = await pool.query(`
      SELECT 
        b.*,
        j.judgmentCitation as citation
      FROM bookmarks b
      LEFT JOIN judgment j ON b.judgmentId = j.judgmentId
      WHERE b.uid = ?
      ORDER BY b.created_at DESC
    `, [uid]);

    res.status(200).json({
      success: true,
      bookmarks: bookmarks
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
      error: error.message
    });
  }
});
